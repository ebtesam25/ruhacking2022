import React, {Component, useState} from 'react';
import {View, Incubator, Text, Button, ActionBar} from 'react-native-ui-lib';
import { TextInput } from 'react-native-paper';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';

export default function Login() {

    const navigation = useNavigation();

    const [email, setemail] = useState('');
    const [pass, setpass] = useState('');
    const [name, setname] = useState('');
    const [phone, setphone] = useState('');
    const [userid, setuserid] = useState('');

    const _loginuser = () => {
      navigation.navigate('Home')
        // var myHeaders = new Headers();
        // myHeaders.append("Content-Type", "application/json");

        // var raw = JSON.stringify({
        // "action": "login",
        // "email": email,
        // "password": pass
        // });

        // var requestOptions = {
        // method: 'POST',
        // headers: myHeaders,
        // body: raw,
        // redirect: 'follow'
        // };

        // fetch("https://us-central1-aiot-fit-xlab.cloudfunctions.net/aphrodite", requestOptions)
        // .then(response => response.json())
        // .then(result => {console.log(result); setuserid(result.userid); navigation.navigate('Home',{userid:result.userid})})
        // .catch(error => console.log('error', error));
    }
    return (
      <View flex>
            <View marginV-100>
                <Image source={require('../images/logo.png')} style={{width:100, height:100, alignSelf:'center'}}></Image>
                <Text style={{fontSize: 28, fontWeight: '300', lineHeight: 30, textAlign:'center'}}>aphrodite</Text>
            </View>



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
          <Button onPress={()=>_loginuser()} text70 white background-red10 style={{width:'70%'}} borderRadius={5} labelStyle={{fontWeight:'bold'}} label="Login"/>
        </View>
      </View>
    );
}