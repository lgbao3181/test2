import { taoMoi } from '@/db';
import Fontisto from '@expo/vector-icons/Fontisto';
import { SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
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
                  
            </View>

        </View>
        )
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
});
