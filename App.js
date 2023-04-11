import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Login } from './src/pages/login';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  GoogleSignin.configure({
    webClientId: '70089461732-i81e9abh6j6sg2ll618okf611p6kg9fq.apps.googleusercontent.com',
  });

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  async function signOut() {
    await auth().signOut()
    .then(async () => {
      await GoogleSignin.signOut()
      .then(() => setUser(null));
    })
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return <Login />;
  }

  return (
    <View style={{flex: 1, alignItems:"center", justifyContent:"center", paddingTop:40, backgroundColor: `purple`}}>
      <Text style={{fontSize:20, marginBottom: 10, textAlign:"center", color: `#e1e1e1`}}>{`Welcome \n${user.email}`}</Text>
    <Button title="Sair" onPress={() => auth().signOut()}/>
    </View>
  );
}