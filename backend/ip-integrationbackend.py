import os
import pymongo
import json
import random
import hashlib
import time

import requests



def dummy(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    if request.method == 'OPTIONS':
        # Allows GET requests from origin https://mydomain.com with
        # Authorization header
        headers = {
            'Access-Control-Allow-Origin': ['*', 'localhost'],
            'Access-Control-Allow-Methods': ['GET', 'OPTIONS'],
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '3600',
            'Access-Control-Allow-Credentials': 'true'
        }
        return ('', 204, headers)

    # Set CORS headers for main requests
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type' : 'application/json'
    }


 
    mongostr = os.environ.get('MONGOSTR')
    client = pymongo.MongoClient(mongostr)
    db = client["aphrodite"]


    retjson = {}

    col = db.covid19

    data = []

    for x in col.find():
        ami = {}
        detail = "Number of Cases in the last 7 days is "
        ami["title"] = x['Area']
        detail += x['Cases'] + " and the infection rate per 100 thounsand is " + x['Rate per 100k']
        ami["detail"] = detail

        
        data.append(ami)

    retjson['items'] = data

    return json.dumps(retjson)

    retstr = "action not done"

    if request.args and 'message' in request.args:
        return request.args.get('message')
    elif request_json and 'message' in request_json:
        return request_json['message']
    else:
        return retstr
