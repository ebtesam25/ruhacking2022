import React, {Component, useEffect, useState} from 'react';
import {View, Incubator, Text, Button, ActionBar} from 'react-native-ui-lib';
import { TextInput } from 'react-native-paper';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { TouchableOpacity } from 'react-native-ui-lib/src/incubator';
import * as ImagePicker from 'expo-image-picker';
import { publish } from 'wonka';
import { pick } from 'lodash';

export default function AddRequest() {

    const navigation = useNavigation();

    const [email, setemail] = useState('');
    const [pass, setpass] = useState('');
    const [name, setname] = useState('');
    const [phone, setphone] = useState('');
    const [userid, setuserid] = useState('');

    const [image, setImage] = useState(null);
    const [image64, setImage64] = useState(null);
    const [imgurl, setImgurl] = useState(null);

   const _addRequest = () => {
               var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "action": "addrequest",
  "name": "Jane Doe",
  "userid": "2",
  "details": "need money to pay medical bills",
  "amount": 1000,
  "imageurl": "https://images.mktw.net/im-444135?width=770&height=939",
  "timestamp": "123479868",
  "latlng": {
    "latitude": 27.5,
    "longitude": -10.2
  },
  "phone": "1234567890"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://us-central1-aiot-fit-xlab.cloudfunctions.net/aphrodite", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}

    useEffect(() => {
        (async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
        })();
    }, [imgurl]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          base64:true,
          aspect: [4, 3],
          quality: 1,
        });
    
    
        if (!result.cancelled) {
            setImage(result.uri);
            setImage64(`data:image/jpg;base64,${result.base64}`);
            setTimeout(() => {
                _publish();
            }, 3000);
        }
      };

      const _publish = () =>{   
        let cloudinary = 'https://api.cloudinary.com/v1_1/diywehkap/image/upload';
         let data = {
           "file": image64,
           "upload_preset": "hm4fkyir",
         }
         console.log(data)
         fetch(cloudinary, {
           body: JSON.stringify(data),
           headers: {
             'content-type': 'application/json'
           },
           method: 'POST',
         }).then(async r => {
           let data = await r.json()
           let curl=data.secure_url;
           await setImgurl(curl.toString());
           await console.log(imgurl, curl);
       });

       {/*.then(fetch('#', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'cache-control': 'no-cache'
         },
         body: JSON.stringify({imgurl:imgurl})
       }).then(async r => {
         let response = await r;
         
         console.log(response.status);  
         console.log(response.body)
     }).catch(err=>console.log(err))
 ).catch(err=>console.log(err));*/}

console.log('Published');
}

    const _registerUser = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "action": "register",
        "name": name,
        "email": email,
        "phone": phone,
        "password": pass
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("https://us-central1-aiot-fit-xlab.cloudfunctions.net/aphrodite", requestOptions)
        .then(response => response.json())
        .then(result => {console.log(result); setuserid(result.userid); navigation.navigate('Home',{userid:result.userid})})
        .catch(error => console.log('error', error));
    }
    return (
      <View flex>
          
            <View marginT-50>
            <Image source={require('../images/logo.png')} style={{width:80, height:80, alignSelf:'center'}}></Image>
            <Text style={{fontSize: 28, fontWeight: '300', lineHeight: 30, textAlign:'center'}}>aphrodite</Text>
            </View>

            <Text marginH-20 marginT-50 style={{fontSize: 17, fontWeight: '800', lineHeight: 17, textAlign:'center'}}>Request for financial support</Text>



            <TextInput
            label="Title"
            mode="outlined"
            style={{width:'70%', alignSelf:'center'}}
            value={name}
            outlineColor={"#CCC"}
            activeOutlineColor={"#F00"}
            onChangeText={text => setname(text)}
            />
            <TextInput
            label="Description"
            mode="outlined"
            multiline
            numberOfLines={10}
            style={{width:'70%', alignSelf:'center'}}
            value={email}
            outlineColor={"#CCC"}
            activeOutlineColor={"#F00"}
            onChangeText={text => setemail(text)}
            />
            <TextInput
            label="Amount ($)"
            mode="outlined"
            style={{width:'70%', alignSelf:'center'}}
            value={phone}
            outlineColor={"#CCC"}
            activeOutlineColor={"#F00"}
            onChangeText={text => setphone(text)}
            />

{!imgurl &&<View marginT-10 center><Button onPress={()=>pickImage()} text70 white background-red70 centerH style={{width:'70%'}} borderRadius={5} labelStyle={{fontWeight:'bold'}} label="Attach"/></View>}
{imgurl&&<Icon name="check-circle" type="fa" color="#F00" style={{marginTop:'10%', marginLeft:'5%'}} size={30}></Icon>}
        <View marginT-100 center>
          <Button onPress={()=>_registerUser()} text70 white background-red10 style={{width:'70%'}} borderRadius={5} labelStyle={{fontWeight:'bold'}} label="Submit"/>
        </View>
      </View>
    );
}