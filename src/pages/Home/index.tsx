import React, { useState, useEffect } from 'react';
import { Alert, FlatList } from 'react-native';

import { Card } from '../../components/Card';
import { Load } from '../../components/Load';
import { TextInput } from 'react-native';

import pokeballImage from '../../assets/img/pokeball.png';

import api from '../../services/api';

import * as S from './styles';
import { useNavigation } from '@react-navigation/native';
import { Content, SubTitle } from '../Welcome/styles';

type PokemonType = {
  type: {
    name: string;
  };
};

export interface Pokemon {
  name: string;
  url: string;
  id: number;
  types: PokemonType[];
}

export interface Request {
  id: number;
  types: PokemonType[];
}

export function Home() {
  const [searchValue, setSearchValue] = useState<string>(''); //buscar pokemon, armazenar valor

  const { navigate } = useNavigation();

  const [load, setLoad] = useState<boolean>(true);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => { //tera o searchValue como depencia
  async function getPokemons(): Promise<void> {
  try {
        const response = await api.get('/pokemon');
        const { results } = response.data;

        const payloadPokemons = await Promise.all(
          results.map(async (pokemon: Pokemon) => {
            const { id, types } = await getMoreInfoAboutPokemonsByUrl(
              pokemon.url,
            );

            return {
              name: pokemon.name,
              id,
              types,
            };
          }),
        );

  //       setPokemons(payloadPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchValue.toLowerCase())) as Pokemon[]);

  //     } catch (err) {
  //       Alert.alert('ops, algo de errado aconteceu, tente mais tarde');
  //     } finally {
  //       setLoad(false);
  //     }
  //   }

  //   getPokemons();
  // }, []);
  
        const filteredPokemons = payloadPokemons.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchValue.toLowerCase())
        );
  
        setPokemons(filteredPokemons);
      } catch (err) {
        Alert.alert('Ops, algo de errado aconteceu, tente novamente mais tarde');
      } finally {
        setLoad(false);
      }
    }
  
    getPokemons();
  }, [searchValue]); //pesquisar pokemon
  
  async function getMoreInfoAboutPokemonsByUrl(url: string): Promise<Request> {
    const response = await api.get(url);

    const { id, types } = response.data as Request;

    return { id, types };
  }

  function handleNavigationPokemonDetail(pokemonId: number) {
    navigate('About', {
      pokemonId,
    });
  }
  return load ? (
    <S.LoadingScreen>
      <Load />
    </S.LoadingScreen>
  ) : (
    <>
      <S.Container>
        <FlatList
          ListHeaderComponent={
            <>
              <S.Header source={pokeballImage} />
              <S.Title> Pokédex</S.Title>
              <TextInput
              placeholder="Explore o mundo dos Pokémon!"
              style={{

                padding: 8,
                marginTop: 16
             }} />

              <TextInput
               placeholder="Pesquisar Pokemon"
                style={{
                          backgroundColor: '#DCDCDC',
                          borderRadius: 8,
                          padding: 8,
                          marginTop: 16,
                          marginBottom: 16,
                       }}
                       value={searchValue}
                      onChangeText={setSearchValue}
              />

            </>
          }
          
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
          data={pokemons}
          keyExtractor={pokemon => pokemon.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: pokemon }) => (
            <Card
              data={pokemon}
              onPress={() => {
                handleNavigationPokemonDetail(pokemon.id);
              }}
            />
          )}
        />
      </S.Container>
    </>
  );
}
