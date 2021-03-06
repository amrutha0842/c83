import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer';
import {Avatar} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import * as permissions from 'expo-permissions';

export default class CustomSideBarMenu extends Component{
  state = {
    userID:firebase.auth().currentuser.email,
    image:'#',
    name:"",
    docId:"",
  }
  selectPicture = async()=>{
    const{cancelled,uri}=await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.All,
      allowEditing:true,
      aspect:[4,3],
      quality:1
    })
    if(!Cancelled){
      this.setState({image:uri})
      this.uploadImage(uri,this.state.userID)
    }
  }
  uploadImage = async(uri,imageName)=>{
    var response = await fetch(uri);
    var blob = await response.blob()
    var ref = firebase.storage().ref().child("user_profiles/"+imageName)
    return ref.put(blob).then((response)=>{
      this.fetchImage(imageName)
    })
  }
  fetchImage=(imageName)=>{
    var storageref = firebase.storage().ref().child("user_profiles/"+imageName);
    storageref
    .getDownloadURL()
    .then((url)=>{
      this.setState({image:url})
    })
    .catch((error)=>{
      this.setState({image:"#"})
    })
  }
  getUserProfile(){
    db.collection("users").where("email_id","==",this.state.userID)
    .onSnapshot((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        this.setState({
          name:doc.data().first_name+" "+doc.data().last_name,
          docId:doc.id,
          image:doc.data().image,
        })
      })
    })
  }
  componentDidMount(){
    this.fetchImage(this.state.userID);
    this.getUserProfile()
  }
  render(){
    return(
      <View style = {{flex:1
      }}> 
      <View style = {{flex:0.5,alignItems:"center",backgroundColor:'yellow'}}>
        <Avatar
        rounded
        source = {{uri:this.state.image,}}
        size = "medium"
        onPress = {()=>this.selectPicture()}
        containerStyle = {styles.imageContainer}
        showEditButton
        />
        <Text style = {{fontWeight:100, fontSize:20, paddingTop:10}}>
          {this.state.name}
        </Text>
      </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props}/>
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
          onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}>
            <Text>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container : {
    flex:1
  },
  drawerItemsContainer:{
    flex:0.8
  },
  logOutContainer : {
    flex:0.2,
    justifyContent:'flex-end',
    paddingBottom:30
  },
  logOutButton : {
    height:30,
    width:'100%',
    justifyContent:'center',
    padding:10
  },
  logOutText:{
    fontSize: 30,
    fontWeight:'bold'
  }
})