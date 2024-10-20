from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import uvicorn


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def connect_db(sql, args):
    conn = sqlite3.connect('SQLite.db')
    c = conn.cursor()
    c.execute(sql, args)
    return c,conn
 


@app.get('/commonSoaQuery')
def commonSoaQuery(startDate:str,
                   endDate:str,
                   pageSize:int=25,
                   pageNo:int=1):
    '''返回表格数据'''
    offset = (pageNo - 1) * pageSize
    c,conn = connect_db("""
        SELECT * FROM announcement 
        WHERE announcement.announcements_datetime BETWEEN ? AND ?
        ORDER BY announcement.announcements_datetime DESC
        LIMIT ? OFFSET ?""", (startDate, endDate, pageSize, offset))
    
    columns = [column[0] for column in c.description]
    results = [dict(zip(columns, row)) for row in c.fetchall()]

    conn.close()

    return JSONResponse({"status": 0 ,"msg":"ok","data":{"results":results}},status_code=200)


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
