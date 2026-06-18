import os
import requests
import feedparser
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/releases")
def get_releases():
    try:
        # Fetch the feed
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(FEED_URL, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Parse using feedparser
        feed = feedparser.parse(response.text)
        
        releases = []
        for entry in feed.entries:
            # Safely extract fields
            content_val = ""
            if "content" in entry and entry.content:
                content_val = entry.content[0].value
            elif "summary" in entry:
                content_val = entry.summary
                
            releases.append({
                "id": entry.get("id", ""),
                "title": entry.get("title", "BigQuery Update"),
                "updated": entry.get("updated", entry.get("published", "")),
                "link": entry.get("link", ""),
                "content": content_val
            })
            
        return jsonify({
            "status": "success",
            "title": feed.feed.get("title", "BigQuery Release Notes"),
            "releases": releases
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)
