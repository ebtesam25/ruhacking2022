import os
import pymongo
import json
import random
import hashlib
import time

import requests

from hashlib import sha256





def sendsms(tonum, message):


    url = "https://us-central1-aiot-fit-xlab.cloudfunctions.net/sendsms"

    payload = json.dumps({
    "receiver": tonum,
    "message": message,
    "token": "xxxxxxx"
    })
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    # print(response.text)

def hashthis(st):


    hash_object = hashlib.md5(st.encode())
    h = str(hash_object.hexdigest())
    return h



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
            'Access-Control-Allow-Methods': ['POST', 'OPTIONS'],
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '3600',
            'Access-Control-Allow-Credentials': 'true'
        }
        return ('', 204, headers)

    # Set CORS headers for main requests
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
    }

    request_json = request.get_json()



    receiver_public_key = os.environ.get('ownpublic')

    mongostr = os.environ.get('MONGOSTR')
    client = pymongo.MongoClient(mongostr)
    db = client["aphrodite"]


    retjson = {}

    action = request_json['action']


    if action == "donate":
        tophone = request_json['phone']
        amount = float(request_json['amount'])

        col = db.users

        found = 0
        id = "0"
        for x in col.find():
            if x['phone'] == tophone:
                found = 1
                id = x['id']

            break
        if found == 0:
            retjson['status'] = "unknown number"

            return json.dumps(retjson)
        
        col.update_one({"id": id}, {"$inc":{"balance":amount}})

        retjson['status'] = "donation successful"

        return json.dumps(retjson)



    if action == "donate2request":
        torequest = request_json['requestid']
        amount = float(request_json['amount'])
        tophone = ""

        col = db.requests

        found = 0
        id = "0"
        for x in col.find():
            if x['id'] == torequest:
                found = 1
                id = x['id']
                tophone = x['phone']
                break
                
        if found == 0:
            retjson['status'] = "unknown"

            return json.dumps(retjson)
        amt = -1.0 * amount
        col.update_one({"id": id}, {"$inc":{"balance":amt}})
        col.update_one({"id": id}, {"$set":{"status":"donated"}})


        retjson['status'] = "donation successful"

        return json.dumps(retjson)




    if action == "checklegalstatus":
        col = db.legalstatus

        state = request_json['state']
        state = state.lower()

        for x in col.find():
            if x['STATE'].lower() == state:
                retjson['status'] = "found"
                retjson['state'] = x['STATE']
                retjson['legal status'] = x['LEGAL STATUS OF ABORTION']
                retjson['details'] = x['WHY']
                retjson['time of effect'] = x['WHEN IN EFFECT']

                return json.dumps(retjson)

        retjson['status'] = "unknown"
        retjson['state'] = "not found"
        retjson['legal status'] = "unknown"
        retjson['details'] = "not found"

        return json.dumps(retjson)




    if action == "getuseridfromphone":
        col = db.users

        for x in col.find():
            if x['phone'] == request_json['phone']:
                retjson['status'] = "found"
                retjson['name'] = x['name']
                retjson['id'] = x['id']
                retjson['balance'] = x['balance']

                return json.dumps(retjson)

        retjson['status'] = "unknown"
        retjson['name'] = "none"
        retjson['id'] = "-1"
        retjson['balance'] = 0

        return json.dumps(retjson)



    if action == "addrequest":
        
        maxid = 1
        col = db.requests
        for x in col.find():
            id = x["id"]
            maxid +=1
        id = str(maxid+1)

        payload = {}

        uid = id 
        payload["id"] = id
        # payload["uid"] = request_json['uid']
        payload["name"] = request_json['name']
        
        payload["userid"] = request_json['userid']
        payload["details"] = request_json['details']
        payload["amount"] = request_json['amount']
        payload["balance"] = request_json['amount']
        payload["phone"] = request_json['phone']
        payload["status"] = "open"
        payload["imageurl"] = request_json['imageurl']
        payload["timestamp"] = request_json['timestamp']
        payload["lat"] = request_json['latlng']['latitude']
        payload["lng"] = request_json['latlng']['longitude']
        

        
        result=col.insert_one(payload)

        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "successfully added"
        retjson['markerid'] = id

        return json.dumps(retjson)




    if action == "getallrequests":
        col = db.requests

        data = []

        for x in col.find():
            ami = {}
            latlng = {}
            ami["id"] = x["id"]
            ami["name"] = x["name"]
            ami["userid"] = x["userid"]
            ami["amount"] = x["amount"]
            ami["details"] = x["details"]
            ami["phone"] = x["phone"]
            ami["imageurl"] = x["imageurl"]
            ami["timestamp"] = x["timestamp"]
            ami['balance'] = x['balance']
            ami['status'] = x['status']
            latlng["latitude"] = x["lat"]
            latlng["longitide"] = x["lng"]
            
            ami["latlng"] = latlng
            
            data.append(ami)

        retjson['requests'] = data

        return json.dumps(retjson)




    if action == "getallusers":
        col = db.users

        data = []

        for x in col.find():
            ami = {}
            
            ami["id"] = x["id"]
            ami["name"] = x["name"]
            
            ami["details"] = x["details"]
            ami["phone"] = x["phone"]
            ami["imageurl"] = x["imageurl"]
            ami['balance'] = x['balance']

            
            data.append(ami)

        retjson['users'] = data

        return json.dumps(retjson)





    if action == "getuserdata":
        col = db.users
        for x in col.find():
            if int(x['id']) == int(request_json['userid']):
                name = x['name']

                address = x['address']


                retjson = {}

                # retjson['dish'] = userid
                retjson['status'] = "success"
                retjson['name'] = name
                retjson['address'] = address                
                retjson['email'] = x['email']
                retjson['phone'] = x['phone']
                retjson['cuisine'] = x['cuisine']
                retjson['publickey'] = x['publickey']
                

                return json.dumps(retjson)
        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "fail"
        retjson['id'] = "-1"

        return json.dumps(retjson)


    if action == "updateuserdata":
        col = db.users
        for x in col.find():
            if int(x['id']) == int(request_json['id']):
                retjson = {}
                retjson['id'] = x['id']
                retjson['name'] = x['name']
                retjson['tags'] = x['tags']
                retjson['email'] = x['email']
                retjson['phone'] = x['phone']
                retjson['mnemonic'] = x['mnemonic']
                


                if 'name' in request_json:
                    col.update_one({"id": x['id']}, {"$set":{"name":request_json['name']}})
                    retjson['name'] = x['name']
                if 'mnemonic' in request_json:
                    col.update_one({"id": x['id']}, {"$set":{"mnemonic":request_json['mnemonic']}})
                    retjson['mnemonic'] = x['mnemonic']
                if 'tags' in request_json:
                    col.update_one({"id": x['id']}, {"$set":{"tags":request_json['tags']}})
                    retjson['tags'] = x['tags']
                if 'email' in request_json:
                    col.update_one({"id": x['id']}, {"$set":{"email":request_json['email']}})
                    retjson['email'] = x['email']
                if 'phone' in request_json:
                    col.update_one({"id": x['id']}, {"$set":{"email":request_json['phone']}})
                    retjson['phone'] = x['phone']
                if 'addtag' in request_json:
                    col.update_one({"id": x['id']}, {"$push":{"tags":request_json['addtag']}})
                if 'removetag' in request_json:
                    col.update_one({"id": x['id']}, {"$pull":{"tags":request_json['removetag']}})
                    
                # status = x['status']

                retjson['responsestatus'] = "success"
                 

                return json.dumps(retjson)
        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "fail"
        retjson['id'] = "-1"

        return json.dumps(retjson)



    if action == "getevents":
        col = db.events
        tables = []
        for x in col.find():

            found = 0
            if "*" in request_json['tags']:
                found = 1
            else:
                for t in request_json['tags']:
                    if t in x['tags']:
                        found = 1
                        break
            
            if found == 0:
                continue
            table = {}

            table['eventid'] = x['id']
            table['name'] = x['name']
            table['date'] = x['date']
            table['time'] = x['time']
            table['location'] = x['location']
            table['image'] = x['image']
            table['description'] = x['description']
            table['link'] = x['link']
            table['orgid'] = x['orgid']
            table['tags'] = x['tags']
            

            tables.append(table)

            


        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "success"
        retjson['events'] = tables
        

        return json.dumps(retjson)
        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "fail"
        retjson['id'] = "-1"

        return json.dumps(retjson)





    if action == "getnews":
        col = db.news
        tables = []
        for x in col.find():

            found = 0
            if "*" in request_json['tags']:
                found = 1
            else:
                for t in request_json['tags']:
                    if t in x['tags']:
                        found = 1
                        break
            
            if found == 0:
                continue
            table = {}

            table['eventid'] = x['id']
            table['name'] = x['name']
            table['date'] = x['date']
            table['time'] = x['time']
            table['location'] = x['location']
            table['image'] = x['image']
            table['description'] = x['description']
            table['link'] = x['link']
            table['orgid'] = x['orgid']
            table['tags'] = x['tags']

            tables.append(table)

            


        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "success"
        retjson['events'] = tables
        

        return json.dumps(retjson)
        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "fail"
        retjson['id'] = "-1"

        return json.dumps(retjson)





    if action == "getlinks":
        col = db.links
        tables = []
        for x in col.find():

            found = 0
            if "*" in request_json['tags']:
                found = 1
            else:
                for t in request_json['tags']:
                    if t in x['tags']:
                        found = 1
                        break
            
            if found == 0:
                continue
            table = {}

            table['eventid'] = x['id']
            table['name'] = x['name']
            table['date'] = x['date']
            table['time'] = x['time']
            table['location'] = x['location']
            table['image'] = x['image']
            table['description'] = x['description']
            table['link'] = x['link']
            table['orgid'] = x['orgid']
            table['tags'] = x['tags']

            tables.append(table)

            


        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "success"
        retjson['events'] = tables
        

        return json.dumps(retjson)
        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "fail"
        retjson['id'] = "-1"

        return json.dumps(retjson)







    if action == "registerorganizer" :
        maxid = 1
        col = db.organizers
        for x in col.find():
            id = x["id"]
            maxid +=1
        id = str(maxid+1)

        payload = {}


        uid = id 
        payload["id"] = id
        # payload["uid"] = request_json['uid']
        # payload["name"] = request_json['name']
        payload["name"] = request_json['name']
        payload["email"] = request_json['email']
        payload["phone"] = request_json['phone']

        # payload['address'] = request_json['address']

        payload["password"] = request_json['password']

        payload['pub'] = "-1"
        # payload['pvt'] = "-1"
        

        payload['tags'] = []

        result=col.insert_one(payload)

        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "successfully added"
        retjson['userid'] = id

        return json.dumps(retjson)





    if action == "addevent" :
        maxid = 1
        col = db.events
        for x in col.find():
            id = x["id"]
            maxid +=1
        id = str(maxid+1)

        payload = {}

        uid = id 
        payload["id"] = id
        # payload["uid"] = request_json['uid']
        # payload["name"] = request_json['name']
        payload["name"] = request_json['name']
        payload["date"] = request_json['date']
        payload["time"] = request_json['time']
        payload["location"] = request_json['location']
        payload["tags"] = request_json['tags']
        payload["image"] = request_json['image']
        payload["description"] = request_json['description']
        payload["link"] = request_json['link']
        payload["orgid"] = request_json['orgid']
        

        # payload["password"] = request_json['password']
        
        result=col.insert_one(payload)

        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "successfully added"
        retjson['id'] = id

        return json.dumps(retjson)




    if action == "addnews" :
        maxid = 1
        col = db.news
        for x in col.find():
            id = x["id"]
            maxid +=1
        id = str(maxid+1)

        payload = {}

        uid = id 
        payload["id"] = id
        # payload["uid"] = request_json['uid']
        # payload["name"] = request_json['name']
        payload["name"] = request_json['name']
        payload["date"] = request_json['date']
        payload["time"] = request_json['time']
        payload["location"] = request_json['location']
        payload["tags"] = request_json['tags']
        payload["image"] = request_json['image']
        payload["description"] = request_json['description']
        payload["link"] = request_json['link']
        payload["orgid"] = request_json['orgid']
        

        # payload["password"] = request_json['password']
        
        result=col.insert_one(payload)

        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "successfully added"
        retjson['id'] = id

        return json.dumps(retjson)





    if action == "addlink" :
        maxid = 1
        col = db.links
        for x in col.find():
            id = x["id"]
            maxid +=1
        id = str(maxid+1)

        payload = {}

        uid = id 
        payload["id"] = id
        # payload["uid"] = request_json['uid']
        # payload["name"] = request_json['name']
        payload["name"] = request_json['name']
        payload["date"] = request_json['date']
        payload["time"] = request_json['time']
        payload["location"] = request_json['location']
        payload["tags"] = request_json['tags']
        payload["image"] = request_json['image']
        payload["description"] = request_json['description']
        payload["link"] = request_json['link']
        payload["orgid"] = request_json['orgid']
        

        # payload["password"] = request_json['password']
        
        result=col.insert_one(payload)

        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "successfully added"
        retjson['id'] = id

        return json.dumps(retjson)





    if action == "register" :
        maxid = 1
        col = db.users
        for x in col.find():
            id = x["id"]
            maxid +=1
        id = str(maxid+1)

        payload = {}

        uid = id 
        payload["id"] = id
        # payload["uid"] = request_json['uid']
        # payload["name"] = request_json['name']
        payload["name"] = request_json['name']
        payload["email"] = request_json['email']
        payload["phone"] = request_json['phone']
        payload["gender"] = request_json['gender']

        # payload['address'] = request_json['address']

        payload["password"] = request_json['password']

        payload['pub'] = "-1"
        payload['mnemonic'] = "none"
        
        # payload['pvt'] = "-1"
        

        payload['tags'] = []

        # if "age" in request_json:
        #     payload["age"] = request_json['age']
        # else:
        #     payload["age"] = "-1"

        # payload["publickey"] = request_json['publickey']
        
        result=col.insert_one(payload)

        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "successfully added"
        retjson['userid'] = id

        return json.dumps(retjson)


    if action == "login":
        col = db.users
        for x in col.find():
            if x['email'] == request_json['email'] and x['password'] == request_json['password']:
                userid = x['id']
                name = x['name']
                retjson = {}

                # retjson['dish'] = userid
                retjson['status'] = "success"
                retjson['name'] = name
                retjson['userid'] = userid
                retjson['email'] = x['email']
                retjson['phone'] = x['phone']
                retjson['gender'] = x['gender']
                tags = []
                for t in x['tags']:
                    tags.append(t)
                retjson['tags'] = tags
                

                return json.dumps(retjson)
        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "fail"
        retjson['userid'] = "-1"

        return json.dumps(retjson)




 

    retstr = "action not done"

    if request.args and 'message' in request.args:
        return request.args.get('message')
    elif request_json and 'message' in request_json:
        return request_json['message']
    else:
        return retstr
