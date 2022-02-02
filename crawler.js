var request = require("request");
var cheerio = require("cheerio");
var url = require("url-parse");

var main_url = process.argv[2];
var max_depth = process.argv[3];
var max_links = process.argv[4];

var pages_visited = {[main_url]:0};
const queue = [main_url];
var head = 0;

function crawler(url)
{
	request(url, function(error, response, body)
	{
		var depth = pages_visited[url];
		if (depth > max_depth)
		{
			return 0;
		}

		if(error)
		{
			console.log("Error: " + error);
			return 0;
		}
		console.log("Status: url valid\nDepth: " + depth);
		if(response.statusCode === 200)
		{
			var parsed_body = cheerio.load(body);
		}

		console.log("processing: " + url)

		var links = parsed_body('a[href]');
		links.slice(0, max_links).each(function() {
			link = parsed_body(this).attr('href');
			if(!(link in pages_visited))
			{
				if (!(link.indexOf('http://') === 0 || link.indexOf('https://') === 0))
				{
					link = url + link
				}

				pages_visited[link] = depth + 1;
				queue.push(link);
				console.log(link)
			}
			else
			{
				console.log("skipped, seen")
			}
		});
		console.log("processed: " + url);
		console.log();

		head = head + 1;

		if (head < queue.length)
		{
			crawler(queue[head])
		}
		else
		{
			console.log("\nLinks Discovered: " queue.length)
		}
	});
}

crawler(main_url);