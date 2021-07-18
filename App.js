import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { firebase } from './src/firebase/config'
import { LoginView, HomeView, RegistrationView } from './src/views'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6e5c87',
    accent: '#709f98',
  },
};

export default function App() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
  const usersRef = firebase.firestore().collection('users');
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      usersRef
        .doc(user.uid)
        .get()
        .then((document) => {
          const userData = document.data()
          setLoading(false)
          setUser(userData)
        })
        .catch((error) => {
          setLoading(false)
        });
    } else {
      setLoading(false)
    }
  });
}, []);

  if (loading) {
      return (
        <></>
      )
    }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        { user ? (
            <Stack.Screen name="Home">
              {props => <PaperProvider theme={theme}><HomeView {...props} extraData={user} /></PaperProvider>}
            </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginView} />
            <Stack.Screen name="Registration" component={RegistrationView} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
