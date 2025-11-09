const process = require("process");
const ppt = require("puppeteer");
const EventEmitter = require("events");
const { error } = require("console");


class DownDetector extends EventEmitter {
    detect(site) {
        (async () => {
            let browser;
            try {
                browser = await ppt.launch({
                    headless: "new",
                    executablePath: process.env.EXEC_PATH || null,
                    defaultViewport: null,
                    args: [
                        "--window-size=600,600",
                        "--disable-infobars",
                        "--no-sandbox",
                        "--disable-setuid-sandbox"
                    ]
                });
            
                const page = (await browser.pages())[0];
            
                await page.evaluateOnNewDocument(() => {
                    Object.defineProperty(navigator, "webdriver", {
                        get: () => undefined
                    });
                });
            
                await page.goto("https://downdetector.com/status/" + site, {
                    waitUntil: "domcontentloaded",
                    timeout: 30000
                });
            
                // Service URL
                const url = await page.evaluate(() => {
                    const anchor = document.querySelector("#company-status a");
                    return anchor ? anchor.href : null;
                });
            
                // Problems summary
                const problems = await page.evaluate(() => {
                    const nodes = [...document.querySelectorAll(".indicatorChart_percentage")];
                    return {
                        app: nodes[0]?.textContent.replace("%", "").trim() || null,
                        website: nodes[1]?.textContent.replace("%", "").trim() || null,
                        server: nodes[2]?.textContent.replace("%", "").trim() || null
                    };
                });
            
                // User comments
                const comments = await page.evaluate(() => {
                    const myObj = {};
                    const rows = document.querySelectorAll(
                        "#comments-card div[style='margin-left:65px']"
                    );
                    [...rows].forEach((elem, index) => {
                        const user = elem.querySelector("strong");
                        const date = elem.querySelector(".updated");
                        const p = elem.querySelector("p");
                        if (!user || !date || !p) return;
                        const username = user.innerText;
                        const commentText = (p.innerText || "").replace(username, "").trim();
                        myObj[index] = {
                            user: username,
                            date: date.innerText,
                            comment: commentText
                        };
                    });
                    return myObj;
                });
            
                // Locations
                const locations = await page.evaluate(() => {
                    const heading = [...document.querySelectorAll("h2, h3")].find(h =>
                        /Most reported locations|Problem reported locations/i.test(
                            h.textContent.trim()
                        )
                    );
                    if (!heading) return [];
                    const container = heading.parentElement || heading;
                    return [...container.querySelectorAll("a")]
                        .map(a => a.textContent.trim())
                        .filter(Boolean);
                });
            
                // Social media messages
                const social = await page.evaluate(() => {
                    const heading = [...document.querySelectorAll("h2, h3")].find(h =>
                        /reports from social media/i.test(h.textContent.trim())
                    );
                    if (!heading) return [];
                    const container = heading.parentElement || heading;
                    const links = [
                        ...container.querySelectorAll("a[href*='twitter.com'],a[href*='x.com']")
                    ];
                    const posts = [];
                    for (let i = 0; i < links.length - 2; i++) {
                        const handleLink = links[i];
                        const textLink = links[i + 1];
                        const timeLink = links[i + 2];
                    
                        const handle = handleLink.textContent.trim();
                        const text = textLink.textContent.trim();
                        const timestamp = timeLink.textContent.trim();
                    
                        const looksLikeHandle = handle.startsWith("@");
                        const looksLikeTime =
                            /\d{4}-\d{2}-\d{2}/.test(timestamp) || /ago$/i.test(timestamp);
                    
                        if (looksLikeHandle && text && looksLikeTime) {
                            posts.push({
                                handle,
                                text,
                                timestamp,
                                handleUrl: handleLink.href,
                                sourceUrl:
                                    textLink.href || timeLink.href || handleLink.href
                            });
                            i += 2;
                        }
                    }
                    return posts;
                });
            
                // Chart data
                const chart = await page.evaluate(() => {
                    let data = { data: null, baseline: null };
                    document.querySelectorAll("script").forEach(elem => {
                        const html = elem.innerHTML || "";
                        if (
                            html.includes("window.DD.chartTranslations") &&
                            html.includes("window.DD.currentServiceProperties")
                        ) {
                            const array = html
                                .replace(/ /g, "")
                                .replace(/\n/g, "")
                                .split("data:");
                            array.shift();
                            if (array[0]) {
                                const data1 = array[0]
                                    .slice(0, array[0].indexOf("],}") + 1)
                                    .replace(/x/g, '"x"')
                                    .replace(/y/g, '"y"')
                                    .replace(/'/g, '"')
                                    .replace(",]", "]");
                                data.data = JSON.parse(data1);
                            }
                            if (array[1]) {
                                const data2 = array[1]
                                    .slice(0, array[1].indexOf("},}}"))
                                    .replace(/x/g, '"x"')
                                    .replace(/y/g, '"y"')
                                    .replace(/'/g, '"')
                                    .replace(",]", "]");
                                data.baseline = JSON.parse(data2);
                            }
                        }
                    });
                    return data;
                });
            
                const myFinalObj = {
                    url,
                    problems,
                    locations,
                    comments,
                    social,
                    chart
                };
            
                await browser.close();
                this.emit("response", [200, myFinalObj]);
            } catch (err) {
                if (browser) await browser.close().catch(() => {});
                console.error("SCRAPER ERROR:", err.message);
                this.emit("response", [500, { error: err.message }]);
            }
        })();
    }
}

module.exports = DownDetector
