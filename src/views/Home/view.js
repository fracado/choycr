import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config'
import { DataTable } from 'react-native-paper';

export default function HomeView(props) {

    const [entityItem, setEntityItem] = useState('')
    const [entityPro, setEntityPro] = useState('')
    const [entityCon, setEntityCon] = useState('')
    const [entities, setEntities] = useState([])

    const entityRef = firebase.firestore().collection('entities')
    const userID = props.extraData.id

    const optionsPerPage = [2, 3, 4];

    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);

    useEffect(() => {
        entityRef
            .where("authorID", "==", userID)
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const newEntities = []
                    querySnapshot.forEach(doc => {
                        const entity = doc.data()
                        entity.id = doc.id
                        newEntities.push(entity)
                    });
                    setEntities(newEntities)
                },
                error => {
                    console.log(error)
                }
            )
    }, []);

    useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

    const onAddButtonPress = () => {
        if (entityItem && entityItem.length > 0) {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                item: entityItem,
                pro: entityPro,
                con: entityCon,
                authorID: userID,
                createdAt: timestamp,
            };
            entityRef
                .add(data)
                .then(_doc => {
                    setEntityItem('')
                    setEntityPro('')
                    setEntityCon('')
                    Keyboard.dismiss()
                })
                .catch((error) => {
                    alert(error)
                });
        }
    }

    const renderEntity = ({item, index}) => {
        return (
            <View style={styles.entityContainer}>
                <Text style={styles.entityText}>
                    {index}. {item.text}
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Add a new item'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(item) => setEntityItem(item)}
                    value={entityItem}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='What is positive about it?'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(pro) => setEntityPro(pro)}
                    value={entityPro}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='What is negative about it?'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(con) => setEntityCon(con)}
                    value={entityCon}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
            { entities && entities.map((entity, key)=>(
                <View style={styles.listContainer}>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Item</DataTable.Title>
                    <DataTable.Title>Pros</DataTable.Title>
                    <DataTable.Title>Cons</DataTable.Title>
                  </DataTable.Header>

                  <DataTable.Row>
                    <DataTable.Cell>{entity.item}</DataTable.Cell>
                    <DataTable.Cell>{entity.pro}</DataTable.Cell>
                    <DataTable.Cell>{entity.con}</DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Pagination
                    page={page}
                    numberOfPages={1}
                    onPageChange={(page) => setPage(page)}
                    label="1-2 of 6"
                    optionsPerPage={optionsPerPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    showFastPagination
                    optionsLabel={'Rows per page'}
                  />
                </DataTable>
                </View>
              )
            )}
        </View>
    )
}
