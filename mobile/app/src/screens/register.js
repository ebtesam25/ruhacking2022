import React, {Component, useState} from 'react';
import {View, Incubator, Text, Button, ActionBar} from 'react-native-ui-lib';
import { TextInput } from 'react-native-paper';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { TouchableOpacity } from 'react-native-ui-lib/src/incubator';

export default function Register() {

    const navigation = useNavigation();

    const [email, setemail] = useState('');
    const [pass, setpass] = useState('');
    const [name, setname] = useState('');
    const [phone, setphone] = useState('');
    const [userid, setuserid] = useState('');

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
          
            <View marginV-50>
            <Image source={require('../images/logo.png')} style={{width:80, height:80, alignSelf:'center'}}></Image>
            <Text style={{fontSize: 28, fontWeight: '300', lineHeight: 30, textAlign:'center'}}>aphrodite</Text>
            </View>



            <TextInput
            label="Full Name"
            mode="outlined"
            style={{width:'70%', alignSelf:'center'}}
            value={name}
            outlineColor={"#CCC"}
            activeOutlineColor={"#F00"}
            onChangeText={text => setname(text)}
            />
            <TextInput
            label="Email"
            mode="outlined"
            style={{width:'70%', alignSelf:'center'}}
            value={email}
            outlineColor={"#CCC"}
            activeOutlineColor={"#F00"}
            onChangeText={text => setemail(text)}
            />
            <TextInput
            label="Phone"
            mode="outlined"
            style={{width:'70%', alignSelf:'center'}}
            value={phone}
            outlineColor={"#CCC"}
            activeOutlineColor={"#F00"}
            onChangeText={text => setphone(text)}
            />
            <TextInput
            label="Password"
            mode="outlined"
            style={{width:'70%', alignSelf:'center'}}
            value={pass}
            outlineColor={"#CCC"}
            activeOutlineColor={"#F00"}
            secureTextEntry
            onChangeText={text => setpass(text)}
            />
       
        <View marginT-100 center>
          <Button onPress={()=>_registerUser()} text70 white background-red10 style={{width:'70%'}} borderRadius={5} labelStyle={{fontWeight:'bold'}} label="Register"/>
        </View>
        <TouchableOpacity onPress={()=>navigation.navigate('Login')}><Text style={{textAlign:'center', fontSize:15,fontWeight: '300', lineHeight: 30}}>Already have an account? Login</Text></TouchableOpacity>
      </View>
    );
}