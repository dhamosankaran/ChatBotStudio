import uvicorn

if __name__ == "__main__":
    uvicorn.run("src.api.main:app", host="0.0.0.0", port=8000, reload=True) 

#/Users/kalaidhamu/Downloads/MarketResearch/venv/bin/python -m uvicorn src.api.main:app --reload --port 8000