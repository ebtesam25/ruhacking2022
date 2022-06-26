import { Image, ToastAndroid } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import {View, Incubator, Text, Button, ActionBar, SkeletonView} from 'react-native-ui-lib';
import AppLoading from 'expo-app-loading';
import { useEffect, useState } from 'react';
import { Icon } from 'react-native-elements';

export default function Requests({route}) {
    const navigation = useNavigation();
    //const {userid, name} = route.params;
    

      const [like, setlike] = useState('1')
      const [donate, setdonate] = useState('')
      const [success, setsuccess] = useState(false);
      const [pendingreq, setpendingreq] = useState({"requests": [{"id": "1", "name": "muntaser", "amount": "2000", "details": " hello i recently lost my job and cannot afford to pay off my medical bills", "phone": "+13218775974", "imageurl": "https://cdn.winknews.com/wp-content/uploads/2020/02/s0130-cbsn-social-medicalbillnegotiation-2017837-640x360-1.jpg", "timestamp": "1647170324", "balance": 2000.0, "status": "unfilled", "latlng": {"latitude": "50.511409592011084", "longitide": "30.62187653816344"}}, 
      {"id": "2", "name": "muntaser", "amount": "3000", "details": " Need to travel to New Mexico for an abortion but I cannot afford it", "phone": "+13218775974", "imageurl": "https://images.mktw.net/im-444135?width=770&height=939", "timestamp": "1647189185", "balance": 3000.0, "status": "unfilled", "latlng": {"latitude": "50.50307", "longitide": "30.47261"}}]})
     

     const _allRequests = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({
          "action": "getallrequests"
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
          _getAllMarkers();
      }, [])

      const _getAllMarkers = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({
          "action": "getallrequests"
        });
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        fetch("https://us-central1-aiot-fit-xlab.cloudfunctions.net/masongives", requestOptions)
          .then(response => response.json())
          .then(result => {console.log(result);setpendingreq(result)})
          .catch(error => console.log('error', error));
    }

    const _donate = (id, amount) => {
        console.log(id,amount);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "action": "donate2request",
        "requestid": id,
        "amount": amount
        });

        console.log(raw);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("https://us-central1-aiot-fit-xlab.cloudfunctions.net/masongives", requestOptions)
        .then(response => response.json())
        .then(result => {console.log(result);if(result.status=="donation successful"){ToastAndroid.show('Donation successful! Thank you', ToastAndroid.SHORT);}})
        .catch(error => console.log('error', error));
    }
    
        return (
    <View flex>
      
    
      <View marginT-50 marginH-20 row>
                <Image source={require('../images/logo.png')} style={{width:30, height:30, alignSelf:'center'}}></Image>
                <Text style={{fontSize: 25, fontWeight: '300', lineHeight: 25, textAlign:'center'}}>aphrodite</Text>
            </View>
            <View marginV-10 center>
            <Button onPress={()=>{navigation.navigate('AddRequest')}} text70 white background-red10 style={{width:'70%'}} borderRadius={5} labelStyle={{fontWeight:'bold'}} label="Add Request"/>
            </View>
            <View style={{height:640}}>
                <ScrollView>{pendingreq.requests.map((item)=>(<View style={{alignSelf:'center', alignContent:'center', borderRadius:20, borderWidth:1, borderColor:'#EAEAEA', paddingBottom:'5%', elevation:1}} background-red10>
            <View background-red50 style={{alignSelf:'center', alignContent:'center', borderRadius:20, opacity:1, marginBottom:'5%', paddingBottom:'5%'}}>
                <View style={{alignSelf:'center', alignContent:'center', borderRadius:20,backgroundColor:"#FFF", opacity:1, marginBottom:'5%'}}>
                    <Text background-red70 style={{position:'absolute', opacity:0.5, borderTopRightRadius:20,borderBottomLeftRadius:20, top:0, right:0, zIndex:3, width:100, height:50, textAlignVertical:'center', textAlign:'center', fontFamily:'Roboto'}}>{item.status}</Text>
                <Image source={{uri:item.imageurl}} style={{width:300, height:150, borderRadius:20}}></Image>
                <Text style={{fontWeight:'bold', color:'#000', fontSize:20, marginHorizontal:'5%'}}>${item.balance}</Text>
                <Text style={{fontFamily:'Roboto', color:'#000', fontSize:15, marginHorizontal:'5%', marginBottom:'0%', flexWrap:'wrap', width:250}}>{item.details}</Text>
                <Text style={{fontFamily:'Roboto', color:'#005BBB', fontSize:10, marginHorizontal:'5%', marginBottom:'5%'}}>{item.restaurantname}</Text>
                </View>
                <Icon name={like==item.id?"heart":"hearto"} type="ant-design" onPress={()=>setlike(item.id)} color={like==item.id?"red":"black"}></Icon>
            </View>
            {like==item.id&&<View style={{flexDirection:'row', alignSelf:'center', width:'70%'}}><View style={{width:'70%', backgroundColor:"#FFF", height:40, borderBottomLeftRadius:10,borderTopLeftRadius:10, alignSelf:'center', padding:'2.5%', opacity:0.5}}>
                <TextInput placeholder="Donate" style={{fontFamily:'Roboto'}} value={donate} onChangeText={(e)=>setdonate(e)}></TextInput>
            </View>
            <TouchableOpacity onPress={()=>_donate(item.id,donate)}>
                <View  style={{ marginTop:'5%',borderBottomRightRadius:10,borderTopRightRadius:10,width:40, height:40, alignSelf:'center', backgroundColor:"#FFF", justifyContent:'center', elevation:1}}><Icon name="check" color="#F00"></Icon>
        </View></TouchableOpacity>
            </View>}
            </View>))}</ScrollView>

            </View>
            

          
            <View row spread paddingH-80 paddingV-10 background-red10 bottom style={{position:'absolute', width:'100%', bottom:0}}>
                <Icon onPress={()=>navigation.navigate('Home')} name="home" type="feather" color="#FFF"></Icon>
                <Icon onPress={()=>navigation.navigate('Requests')} name="dollar-sign" type="feather" color="#FFF"></Icon>
                <Icon name="user" type="feather" color="#FFF"></Icon>
            </View>
            

        
    </View>
    )
};