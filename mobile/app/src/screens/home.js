import React, {Component, useState} from 'react';
import {View, Incubator, Text, Button, ActionBar, SkeletonView} from 'react-native-ui-lib';
import { TextInput } from 'react-native-paper';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { Icon } from 'react-native-elements'
import { ListItem } from 'react-native-material-ui';
import MapView from 'react-native-maps';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

export default function Home() {

    const navigation = useNavigation();
    const [zip, setzip] = useState('');
    const [legalstatus, setlegalstatus] = useState('Please set a ZIP code');
    const [hospitals, sethospitals] = useState({"hospitals":[{"id":"1","name":"AAA","address":"4000 Hospital Dr","hours":"10-8","distance":"10mi","latlng":{"latitude":38.831866,"longitude":-77.300209}}]})


    const _getLegalStatus = () =>{
        var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "action": "checklegalstatus",
  "state": "Virginia"
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

    const _setZip = (zip) => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch(`http://api.positionstack.com/v1/forward?access_key=27b40a4b9c1b771ffb379d8272c192e3&query=${zip}`, requestOptions)
            .then(response => response.json())
            .then(result => {console.log(result);setlegalstatus(result.data[0].region)})
            .catch(error => console.log('error', error));
    }

    const Hospital = ({ item}) => (
        <View br20 background-blue70 margin-20 paddingH-5 paddingV-20>
            <Text marginH-20 style={{fontSize: 17, fontWeight: '800', lineHeight: 17}}>{item.name}</Text>
            <Text marginH-20 style={{fontSize: 15, fontWeight: '300', lineHeight: 17}}>{item.address}</Text>
            <View marginV-2></View>
            <Text marginH-20 style={{fontSize: 10, fontWeight: '300', lineHeight: 12}}>{item.hours}</Text>
            <Text marginH-20 style={{fontSize: 10, fontWeight: '300', lineHeight: 12}}>{item.distance}</Text>

        </View>
    );

    
    return (
      <View flex>
            <View marginV-50 marginH-20 row>
                <Image source={require('../images/logo.png')} style={{width:30, height:30, alignSelf:'center'}}></Image>
                <Text style={{fontSize: 25, fontWeight: '300', lineHeight: 25, textAlign:'center'}}>aphrodite</Text>
            </View>

            <Text marginH-20 style={{fontSize: 17, fontWeight: '300', lineHeight: 17}}>Please enter your ZIP code to find resources relevant to your area</Text>
            
            <View row><TextInput
            label="ZIP"
            mode="outlined"
            style={{width:'37%', marginHorizontal:20}}
            value={zip}
            outlineColor={"#CCC"}
            activeOutlineColor={"#F00"}
            onChangeText={text => setzip(text)}
            />
            <View>
            <Button onPress={()=>_setZip(zip)} text70 white background-red10 marginV-5 style={{width:'50%', height:55}} borderRadius={5} labelStyle={{fontWeight:'bold'}} label="Set"/>
            </View>
            </View>

            <View br20 background-red70 margin-20 paddingH-5 paddingV-20>
            <Text marginH-20 style={{fontSize: 17, fontWeight: '800', lineHeight: 17}}>Legal Status</Text>
            <Text marginH-20 marginT-5 style={{fontSize: 15, fontWeight: '300', lineHeight: 17}}>{legalstatus}</Text>
            </View>
            <Text marginH-20 style={{fontSize: 17, fontWeight: '800', lineHeight: 17}}>Abortion Facilities Nearby</Text>
      
           

            <View style={{backgroundColor:"#FFF", borderTopLeftRadius:20, borderTopRightRadius:20}} margin-10>
                      <MapView style={{width: 400,height: 500, alignSelf:'center'}} 
                        initialRegion={{
                            latitude: 38.830007,
                            longitude: -77.314510,
                            latitudeDelta: .005,
                            longitudeDelta: .005
                            }} 
                            >
                            {
                                hospitals.hospitals.map((marker, i) => (
                                    <MapView.Marker key={i} coordinate={{"latitude":parseFloat(marker.latlng.latitude),"longitude":parseFloat(marker.latlng.longitude)}} title={marker.name} description={marker.address}>
                                        <Image source={{uri:'https://img.icons8.com/fluency/34/000000/hospital-2.png'}} style={{height:20, width:20}}></Image>
                                    </MapView.Marker>
                                    
                                    
                                ))}
                        </MapView>
                  


          </View>
      

            <View row spread paddingH-80 paddingV-10 background-red10 bottom style={{position:'absolute', width:'100%', bottom:0}}>
                <Icon name="home" type="feather" color="#FFF"></Icon>
                <Icon onPress={()=>navigation.navigate('Requests')} name="dollar-sign" type="feather" color="#FFF"></Icon>
                <Icon name="user" type="feather" color="#FFF"></Icon>
            </View>



            
        
      </View>
    );
}
