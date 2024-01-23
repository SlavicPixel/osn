# 2. Seminarski rad - Mrežni i mobilni operacijski sustavi
## Autor: Dominik Ivošić
## Mentor: Matija Burić

# Preduvjeti

Prije početka razvoja [Expo](expo.dev) aplikacije, potrebno je postaviti odgovaraćuje okruženje na računalnu i mobilnom uređaju. Potrebno je slijediti ove korake kako bi se osigurao ispravan rad u okruženju i mobilnom uređaju:

## 1. Postavljanje razvojnog okruženja

- Node.js: Potrebno je instalirati najnoviju stabilnu verziju Node.js-a sa službene stranice [Node.js](https://nodejs.org/en). Node.js je neophodan za pokretanje JavaScript koda izvan preglednika, a koristi se i za upravljanje paketima aplikacije.

- npm ili Yarn: upravitelji paketima za JavaScript, a npm dolazi zajedno s instalacijom Node.js-a. Yarn je alternativa koja se možete preuzeti s [Yarn](https://yarnpkg.com).

- IDE: Visual Studio Code ili alternativa.

## 2. Expo preduvjeti

Nakon kreiranja projekta na [Expo](expo.dev), potrebno je izvršiti slijedeće komande u terminalnu:

- `npm install --global eas-cli` command-line sučelje za interakciju s [EAS](https://expo.dev/eas) (Expo Appliaction Services).

- Komandom `npx create-expo-app [ime_projekta]` postavlja se okruženje za izradu aplikacije.

- Nakon kreiranja okruženja potrebno je komandom `cd [ime_projekta]` pozicionirati se unutar radnog okruženja.

- Na kraju je još potrebno komandom `eas init --id [id_broj]` povezati EAS projekt.

## 3. Android/iOS Expo aplikacija

Potrebno je preuzeti Expo Client aplikaciju za mobilni uređaj sa [Google Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US) ili [Apple App Store (iOS)](https://apps.apple.com/us/app/expo-go/id982107779). Ova aplikacija omogućuje pregledavanje React Native aplikacije na mobilnom uređaju tijekom razvoja.

## 4. Specifični preduvjeti

Osim već navedenih preduvjeta, aplikacija koja će biti razrađena unutar ovog seminara dodatno zahtjeva još nekoliko ovisnosti:

- `expo install expo-sensors` - Expo paket koji omogućuje rad sa senzorima na Android i iOS platformama

- Potrebno je još instalirati slijedeće pakete kako bi se omogućila jednostavna navigacija unutar aplikacije:

```shell
$ expo install react-native-screens react-native-safe-area-context
$ npm install @react-navigation/bottom-tabs
```
Napomena: za instaliravanje svih potrebnih ovisnosti ovog projekta, moguće ih je instalirati komandom `yarn` u terminalnu.

## 5. Pokretanje aplikacije

`npm start` komandom u terminalnu pokrećemo aplikaciju, te skeniranjem QR koda preko Expo mobilne aplikacije možemo pregledati rad naše aplikacije na mobilnom uređaju.

Također postoje opcije za izravno pokretanje aplikacije na računalu ukoliko je mobilni uređaj povezan na računalno putem USB kabela:

- `npm start android`

- `npm start ios` 

# OSN (Old School Navigation) - React Native aplikacija

OSN (Old School Navigation) je jednostavna aplikacija koja donosi klasičnu navigaciju kompasom na mobilni uređaj. Aplikacija koristi senzor magnetometra unutar Android uređaja za prikaz tradicionalnog sučelja kompasa.

<div align="center">
    <figure>
        <img src="osn/demo/demo.gif" alt="Demo aplikacije" style="width: 50%;"/>
        <figcaption>Demo aplikacije</figcaption>
</div>

<div align="center">
    <figure style="display: inline-block; margin-right: 20px;">
        <img src="osn/demo/compass.jpg" alt="Compass Screen" style="width: 300px;"/>
        <figcaption>CompassScreen.js</figcaption>
    </figure>
    <figure style="display: inline-block;">
        <img src="osn/demo/about.jpg" alt="About Screen" style="width: 300px;"/>
        <figcaption>AboutScreen.js</figcaption>
    </figure>
</div>

## React Native kôd aplikacije

### App.js

```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import CompassScreen from './CompassScreen'; // Separate file for Compass
import AboutScreen from './AboutScreen'; // Separate file for About

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Compass') {
              iconName = focused ? 'compass' : 'compass-outline';
            } else if (route.name === 'About') {
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Compass" component={CompassScreen} />
        <Tab.Screen name="About" component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

U ovom kodu postavlja se osnova za mobilnu aplikaciju koristeći React Native okruženje.

1. **Uvoz Modula**: Potrebno je uvoziti neophodne module kao što su `React`, `NavigationContainer` za navigacijsku strukturu, `createBottomTabNavigator` za stvaranje navigacije s karticama na dnu ekrana, te `Ionicons` za korištenje ikona.

2. **Kreiranje Navigacijskih Kartica**: `createBottomTabNavigator` se koristi za stvaranje dvije kartice: jedna za ekran kompasa (`CompassScreen`) i druga za informacijski ekran (`AboutScreen`).

3. **Konfiguracija Ikona**: Unutar `Tab.Navigator`, postavlja se ikone za svaku karticu koristeći `Ionicons`. Ikone se mijenjaju ovisno o tome je li kartica aktivna ili ne (npr. za karticu kompasa koristi se 'compass' ili 'compass-outline').

4. **Aktivna i Neaktivna Boja**: Definira se boja za aktivne i neaktivne kartice, gdje je 'tomato' boja za aktivnu karticu, a 'gray' za neaktivnu.

5. **Povezivanje Ekrana s Karticama**: `Tab.Screen` komponente povezuju ekrane `CompassScreen` i `AboutScreen` s njihovim navigacijskim karticama, omogućujući prebacivanje između ekrana.

### CompassScreen.js

```javascript
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import { Magnetometer } from 'expo-sensors';

const { width } = Dimensions.get('window');
const COMPASS_SIZE = width * 0.8; 

export default function App() {
  const [currentDirection, setCurrentDirection] = useState('N'); 
  const [currentDegrees, setCurrentDegrees] = useState('0'); 
  const angle = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    Magnetometer.setUpdateInterval(1000);

    const subscription = Magnetometer.addListener(result => {
      const newAngle = calculateAngle(result);
      setCurrentDegrees(`${Math.round(newAngle)}`);
      setCurrentDirection(calculateDirection(newAngle));

      Animated.timing(angle, {
        toValue: -newAngle, 
        duration: 500,
        useNativeDriver: true
      }).start();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const calculateAngle = ({ x, y }) => {
    if (!x || !y) {
      return 0;
    }
    let newAngle = Math.atan2(y, x) * (180 / Math.PI) + 180;
    return newAngle;
  };

  const calculateDirection = (angle) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
    return directions[index];
  };

  const spin = angle.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg']
  });

  return (
    <View style={styles.container}>
        <View style={styles.info}>
            <Text style={styles.infoText}>{currentDirection}</Text>
            <Text style={styles.infoText}>{currentDegrees}°</Text>
        </View>
      <Animated.View style={[styles.compassCircle, { transform: [{ rotate: spin }] }]}>
        <Text style={[styles.direction, styles.north]}>N</Text>
        <Text style={[styles.direction, styles.northeast]}>NE</Text>
        <Text style={[styles.direction, styles.east]}>E</Text>
        <Text style={[styles.direction, styles.southeast]}>SE</Text>
        <Text style={[styles.direction, styles.south]}>S</Text>
        <Text style={[styles.direction, styles.southwest]}>SW</Text>
        <Text style={[styles.direction, styles.west]}>W</Text>
        <Text style={[styles.direction, styles.northwest]}>NW</Text>
      </Animated.View>
      <Text style={styles.arrow}>↑</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassCircle: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  direction: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
  },
  north: { top: '5%' },
  northeast: { top: '15%', right: '15%' },
  east: { right: '5%' },
  southeast: { bottom: '15%', right: '15%' },
  south: { bottom: '5%' },
  southwest: { bottom: '15%', left: '15%' },
  west: { left: '5%' },
  northwest: { top: '15%', left: '15%' },
  arrow: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'red',
    zIndex: 1, 
  },
  info: {
    position: 'absolute',
    top: COMPASS_SIZE / 3, 
    alignItems: 'center',
  },
  infoText: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
```

Ovaj dio koda odnosi se na logiku i izgled glavnog dijela aplikacije odnosno za prikaz kompasa, koristeći podatke senzora uređaja:

1. **Uvoz Potrebnih Modula**: Uvoze se moduli `React` te različiti elementi iz `react-native`, uključujući `StyleSheet`, `Text`, `View`, `Animated`, `Dimensions`, kao i `Magnetometer` iz `expo-sensors` za pristup senzorima uređaja.

2. **Postavljanje Dimenzija Kompasa**: Koristeći `Dimensions` iz `react-native`, postavlja se veličina kompasa na 80% širine ekrana.

3. **Stanje i Efekti**:
   - Koriste se `useState` i `useEffect` za upravljanje stanjem aplikacije. `useState` se koristi za praćenje trenutnog smjera (`currentDirection`) i stupnjeva (`currentDegrees`).
   - `useEffect` se koristi za postavljanje intervala ažuriranja `Magnetometer` senzora i za pretplatu na podatke senzora. Kada senzor detektira promjenu, ažurira se smjer i stupnjevi.

4. **Izračunavanje Kuta i Smjera**:
   - Funkcija `calculateAngle` izračunava kut na temelju podataka iz senzora.
   - Funkcija `calculateDirection` određuje smjer na temelju izračunatog kuta.

5. **Animacija Kompasa**:
   - Korištenjem `Animated` iz `react-native`, kompas se animira tako da se okreće na temelju izračunatog kuta.

6. **Prikaz Kompasa**:
   - Kompas se prikazuje koristeći `View` i `Text` komponente. `View` komponenta `compassCircle` prikazuje krug kompasa, dok `Text` komponente prikazuju smjerove (N, NE, E, SE, S, SW, W, NW).
   - Na vrhu kompasa prikazuje se trenutni smjer i stupnjevi.

7. **Stilizacija**:
   - `StyleSheet.create` se koristi za definiranje stilova komponenata, uključujući veličinu, boju i pozicioniranje.


### AboutScreen.js

```javascript
import React from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>OSN (Old School Navigation) is a simple compass app written in React using Expo.</Text>
      <Ionicons name="globe-outline" size={24} color="black" onPress={() => Linking.openURL('https://www.dominikivosic.com/')} />
      <Text style={styles.linkText} onPress={() => Linking.openURL('https://www.dominikivosic.com/')}>
        Visit My Website
      </Text>
      <Ionicons name="logo-github" size={24} color="black" onPress={() => Linking.openURL('https://github.com/SlavicPixel')} />
      <Text style={styles.linkText} onPress={() => Linking.openURL('https://github.com/SlavicPixel')}>
        My GitHub
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center'
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginVertical: 5,
  }
});
```

1. **Uvoz React i Native Komponenti**: Uvoze se `React`, zajedno s `View`, `Text`, `Linking` iz `react-native`, te `Ionicons` iz `@expo/vector-icons` za prikaz ikona.

2. **Definiranje Komponente `AboutScreen`**:
   - Komponenta `AboutScreen` je funkcionalna komponenta koja vraća JSX.
   - Unutar `View` kontejnera, postavljen je tekst koji opisuje aplikaciju.
   - Dodane su ikone pomoću `Ionicons` koje, kada se pritisnu, koriste `Linking` za otvaranje web stranice i GitHub profila. Ovdje se koristi `onPress` event za navigaciju.

3. **Poveznice na Web Stranicu i GitHub**: 
   - Dva `Text` elementa služe kao interaktivne poveznice. Kada se klikne na njih, otvaraju se odgovarajuće vanjske poveznice (`Linking.openURL`).

4. **Stilizacija**:
   - `StyleSheet.create` se koristi za definiranje stilova. `container` stavlja sve elemente na sredinu ekrana, `text` određuje izgled i položaj teksta, a `linkText` stilizira tekst poveznica.

Ovaj kod omogućuje korisnicima da saznaju više o aplikaciji, te pruža brz pristup na web stranicu i GitHub profil autora ovog seminara.

## Osnovno profiliranje aplikacije

Koristeći ugrađeni Pefromance Monitor unutar Expo aplikacije, dobiveni su slijedeći rezultati:

<div align="center">
    <figure>
        <img src="osn/demo/performance_monitor.jpg" alt="Pefromance Monitor" style="width: 50%;"/>
        <figcaption>Expo Pefromance Monitor</figcaption>
    </figure>
</div>

- UI Performanse: 119.9 fps (stabilno)

    - Aplikacija ima odlične performanse korisničkog sučelja s konstantnim prikazivanjem od 199.9 sličica u sekundi (fps). Ovo ukazuje na to da se sučelje aplikacije renderira vrlo glatko.

- Ispuštene Sličice: -667 do sada (broj se smanjuje)

    - Broj ispuštenih sličica ili 'dropped frames' od -667, koji se smanjuje, malo je neobičan. Uobičajeno je da se broj ispuštenih sličica povećava ili ostaje konstantan. Smanjenje ovog broja može ukazivati na moguću pogrešku ili anomaliju u alatu za praćenje performansi.

- Zastoji: 0 (4+) do sada

   - Aplikacija nije zabilježila zastoje u radu, što znači da nije bilo značajnih kašnjenja ili zamrzavanja u korisničkom sučelju. Ovo je pozitivan pokazatelj da aplikacija pruža konzistentno iskustvo bez prekida.

- JS Performanse: 119. fps

    - Performanse JavaScripta, koje iznose 119.9 fps, jednake su performansama korisničkog sučelja. Ovo ukazuje na to da JavaScript kod efikasno izvršava operacije i održava korak s brzinom renderiranja sučelja. Visoka brzina izvršavanja JavaScripta ključna je za osiguravanje odzivnosti interakcija i animacija unutar aplikacije.

### Izvještaj o performansama aplikacije

Na temelju pruženih metrika, aplikacija pokazuje visoke i stabilne performanse. Međutim, neobično smanjenje broja ispuštenih sličica zahtijeva dodatnu analizu kako bi se osiguralo da nema greške u alatu za praćenje performansi ili neke druge anomalije u načinu na koji se broje sličice. Ostali aspekti performansi, uključujući brzinu korisničkog sučelja i JavaScripta, su impresivni i ukazuju na visoku učinkovitost i odzivnost aplikacije.

# Literatura

[Expo Documentation](https://docs.expo.dev/)