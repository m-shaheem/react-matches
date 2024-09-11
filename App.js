import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import data from './node_modules/data.json';

function ScoreScreen() {
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchesToDisplay, setMatchesToDisplay] = useState([]);

  useEffect(() => {
    let allMatches = data.sports.flatMap(sport => sport.matches);

    // Apply sport and date filters if they are selected
    if (selectedSport) {
      allMatches = selectedSport.matches;
    }
    
    if (selectedDate) {
      allMatches = allMatches.filter(match => match.date === selectedDate);
    }

    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      allMatches = allMatches.filter((match) => {
        const teamNames = match.teams.map((team) => team.name.toLowerCase());
        const competitionName = match.competition.toLowerCase();

        return teamNames.some((name) => name.includes(lowerCaseQuery)) ||
               competitionName.includes(lowerCaseQuery);
      });
    }

    setMatchesToDisplay(allMatches);
  }, [searchQuery, selectedSport, selectedDate]);

  const dates = Array.from(new Set(data.sports.flatMap(sport => sport.matches.map(match => match.date))));

  const renderSports = (sport) => (
    <TouchableOpacity key={sport.id} onPress={() => setSelectedSport(selectedSport?.id === sport.id ? null : sport)}>
      <Text style={[styles.gamesscroll, selectedSport?.id === sport.id && styles.selectedsport]}>
        {sport.name}
      </Text>
    </TouchableOpacity>
  );

  const renderDate = (date) => (
    <TouchableOpacity key={date} onPress={() => setSelectedDate(selectedDate === date ? null : date)}>
      <Text style={[styles.datescroll, selectedDate === date && styles.selecteddate]}>
        {date}
      </Text>
    </TouchableOpacity>
  );

  const renderMatches = ({ item: match }) => (
    <TouchableOpacity>
      <View key={match.id} style={styles.outermatchcontainer}>
        <Text style={styles.competitiontext}>{match.competition}</Text>
        <View style={styles.innermatchcontainer}>
          {match.teams.map((team, index) => (
            <View key={index} style={styles.teamcontainer}>
              <Image source={{ uri: team.logo }} style={styles.teamlogo} />
              <Text style={styles.teamscore}>{team.name}</Text>
              <Text style={styles.teamscore}>{team.score}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.fulltime}>{match.time}</Text>
        {match.notification && <Icon name="alarm-outline" color={'blue'} size={23} style={styles.fulltime} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <TextInput
        placeholder='Search competition or team'
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchbar}
      />

      {/* Sports scroll */}
      <View style={styles.gamesview}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {data.sports.map(renderSports)}
        </ScrollView>
      </View>

      {/* Date scroll */}
      <View style={styles.datesview}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {dates.map(renderDate)}
        </ScrollView>
      </View>

      {/* Match list */}
      <FlatList
        data={matchesToDisplay}
        keyExtractor={item => item.id}
        renderItem={renderMatches}
      />
    </View>
  );
}

function WatchScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 170, }}>watch</Text>
    </View>
  );
}

function NewsScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 170, }}>news</Text>
    </View>
  );
}

function FavScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 150, }}>Favourites</Text>
    </View>
  );
}

export default function App() {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <StatusBar style='auto' />
      <Tab.Navigator>
        <Tab.Screen
          name="Score"
          component={ScoreScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="football-sharp" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Watch"
          component={WatchScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="videocam-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="News"
          component={NewsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="newspaper-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Favourites"
          component={FavScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="star-outline" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gamesview: {
    marginTop: 10,
    height: 65,
  },
  gamesscroll: {
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 35,
    padding: 15,
    margin: 5,
    fontSize: 15,
    borderBottomWidth: 3,
  },
  selectedsport: {
    backgroundColor: '#9370db',
  },
  datesview: {
    height: 65,
  },
  datescroll: {
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 35,
    padding: 15,
    margin: 5,
    borderBottomWidth: 3,
  },
  selecteddate: {
    backgroundColor: '#9370db',
  },
  outermatchcontainer: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 20,
    padding: 25,
    marginTop: 10,
    marginHorizontal: 20,
    borderBottomWidth: 3,
  },
  innermatchcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamcontainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  teamscore: {
    textAlign: 'center',
    paddingTop: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  teamlogo: {
    alignItems: "center",
    justifyContent: 'center',
    height: 40,
    width: 40,
    backgroundColor: '#9370ff',
  },
  competitiontext: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fulltime: {
    textAlign: 'center',
    fontWeight: '300',
    //fontFamily: 'Cochin',
  },
  searchbar: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 15,
    fontSize: 16,
  },
});
