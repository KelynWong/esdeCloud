/**
 * @author Ang Yun Zane (1949955)
 * @author Wong En Ting Kelyn (1935800)
 * Class:DIT/FT/2A/21
 */
const { readFileSync, stat, ReadStream } = require("fs");
const { resolve, extname } = require('path');
const { parse } = require("url");
var hostname = "localhost";
var port = 3001;
const regex = /\/$/;
const regex2 = /(^|\\|\/)(\.\.|%2e%2e)(\\|\/|$)/i;
/** @type {import('http').RequestListener} */
function server(req, res) {
    try {
    let { pathname, query } = parse(req.url);
    console.log(req.url);
    console.log(req.method);
    console.log(pathname);
    console.log(query);
        if (req.method === "GET") {
            if (regex2.test(pathname)) {
                res.statusCode = 400;
                res.end();
                return;
            }
            if (pathname === "/") { pathname = "/home.html" }
            /** @type {string} */
            let mime;
            switch (extname(pathname)) {
                case '':
                    pathname = regex.test(pathname) ? pathname.replace(regex, ".html") : pathname + ".html";
                case ".html":
                    mime = "text/html; charset=UTF-8";
                    break;
                case '.css':
                    mime = "text/css; charset=UTF-8";
                    break;
                case ".ico":
                    mime = "image/x-icon";
                    break;
                case ".jpg":
                case ".jpeg":
                    mime = "image/jpeg";
                    break;
                case ".png":
                    mime = "image/png";
                    break
                case ".js":
                    mime = "application/javascript; charset=UTF-8";
                    break
                default:
                    res.statusCode = 404;
                    res.end()
                    return;
            }
            pathname = resolve(__dirname, "./public" + pathname);
            res.setHeader("X-Frame-Options", "DENY");
            res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
            res.setHeader("X-Content-Security-Policy", "frame-ancestors 'none'");
            res.setHeader("X-WebKit-CSP", "frame-ancestors 'none'");
            res.setHeader("Server", "Node.js Server-side JavaScript");
            res.setHeader("Tk", "N");
            res.setHeader("Content-Language", "en-SG");
            stat(pathname, (err, data) => {
                if (err) {
                    res.statusCode = 404;
                    res.end()
                } else {
                    let mtime = data.mtime.toUTCString();
                    if (mtime === req.headers['if-modified-since']) {
                        res.statusCode = 304;
                        res.end();
                    } else {
                        res.setHeader("Content-Type", mime);
                        res.setHeader("Cache-Control", "max-age=84600, public");
                        res.setHeader("Content-Length", data.size);
                        res.setHeader("Last-Modified", mtime);
                        res.statusCode = 200;
                        new ReadStream(pathname).pipe(res);
                    }

                }
            })

        } else {
            res.statusCode = 405;
            res.setHeader("Allow", "GET");
            res.end();
        }
    } catch (e) {
        console.error(e);
        res.statusCode = 500;
        res.end();
    }
}
/* Uncomment this if want to use http 
new (require("http")).Server(server).listen(port, hostname, console.log.bind(console, `\x1b[33mServer hosted at \x1b[4mhttp://${hostname}:${port}\x1b[0m`)); */
require("http2").createSecureServer({
    key: readFileSync(resolve(__dirname, "localhost.key")),
    cert: readFileSync(resolve(__dirname, "localhost.crt"))
}, server).listen(3002, hostname, console.log.bind(console, `\x1b[32mServer hosted at \x1b[4mhttps://${hostname}:3002\x1b[0m`))
