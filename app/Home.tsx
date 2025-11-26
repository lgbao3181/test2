import { taoMoi } from '@/db';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import { SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function ModalScreen() {
    interface danhba{
        id:number,
        name :string,
        phone :string,
        email :string,
        favorite :number,
        created_at :number
    }
    const [db,setDb]=useState<SQLiteDatabase|null>(null)
    const [danhBa,setDanhBa]=useState<danhba[]>([])
    const [add,setAdd]=useState(false)
    const [nameAdd,setNameAdd]=useState<string>("")
    const [phoneAdd,setPhoneAdd]=useState<string>("")
    const [emailAdd,setEmailAdd]=useState<string>("")
    useEffect(()=>{
         async function taoDb(){
            const db_t= await taoMoi()
            setDb(db_t)
            const danhba_t:danhba[]= await db_t.getAllAsync('SELECT * FROM DanhBa')
            setDanhBa(danhba_t)
            console.log("DANHBA:",danhba_t)
        }
        taoDb()

    },[])

    function Hienthi(item:danhba){
        return(
        <View>
            <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                  <Text> name:{item.name} </Text>
                  <Text> Phone:{item.phone}</Text>
                  {
                    item.favorite ? <Fontisto name="favorite" size={24} color="black" /> : <></>
                  }
                  <TouchableOpacity onPress={()=>Favorite(item)}>
                    <AntDesign name="star" size={24} color= {item.favorite ? "#aaa12bff":  "black"} />
                  </TouchableOpacity>
                  
            </View>

        </View>
        )
    }

    async function Add(){
        await db?.runAsync('INSERT INTO DanhBa (name, phone, email) VALUES (?, ?, ?);',
            [nameAdd, phoneAdd,emailAdd])
        setAdd(false)
        if(db){
            const danhba_t:danhba[]= await db?.getAllAsync('SELECT * FROM DanhBa')
            setDanhBa(danhba_t)
        }
    }

    async function Favorite(item:danhba){
      if(item.favorite===0)
        await db?.runAsync('UPDATE DanhBa SET favorite = ? WHERE id = ?', [1, item.id]);
      else
        await db?.runAsync('UPDATE DanhBa SET favorite = ? WHERE id = ?', [0, item.id]);
      setAdd(false)
      if(db){
          const danhba_t:danhba[]= await db?.getAllAsync('SELECT * FROM DanhBa')
          setDanhBa(danhba_t)
      }
    }
  return (
<SafeAreaProvider>
    <SafeAreaView>
        <Text>SImple COntaact</Text>
        <FlatList
        data={danhBa}
        keyExtractor={(item,index)=>item.id??index.toString()}
        renderItem={({item})=>Hienthi(item)}
        />

        <TouchableOpacity style={styles.nut} onPress={()=>setAdd(true)}>
            <Text> them lien he </Text>
        </TouchableOpacity>
        <Modal visible={add}
        > 
            <View>
                <Text> them lien he </Text>
                <TextInput style={styles.input} placeholder='name' onChangeText={value=>setNameAdd(value)}></TextInput>
                <TextInput style={styles.input} placeholder='phone' onChangeText={value=>setPhoneAdd(value)}></TextInput>
                <TextInput style={styles.input} placeholder='email' onChangeText={value=>setEmailAdd(value)}></TextInput>

                <TouchableOpacity style={styles.nut}
                onPress={()=>Add()}>
                    <Text> ADD</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    </SafeAreaView>
</SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  input:{
    borderWidth:1,
    borderColor:'black'
  },
  nut:{
    borderWidth:1,
    borderColor:'black',
    backgroundColor:'#61cce1ff'
  }
});
