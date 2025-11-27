import { taoMoi } from '@/db';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import { SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    const [edit,setEdit]=useState(false)
    const [itemEdit,setItemEdit]= useState<Partial<danhba>>({}) 
    const [itemDelete,setItemDelete]= useState<Partial<danhba>>({})
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
          <TouchableOpacity onLongPress={()=>{setItemEdit(item),setEdit(true)}}>
            <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                  <Text> name:{item.name} </Text>
                  <Text> Phone:{item.phone}</Text>
                  {
                    item.favorite ? <Fontisto name="favorite" size={24} color="black" /> : <></>
                  }
                  <TouchableOpacity onPress={()=>Favorite(item)}>
                    <AntDesign name="star" size={24} color= {item.favorite ? "#aaa12bff":  "black"} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.nut} onPress={()=>PressXoa(item)}>
                    <Text> Xoa</Text>
                  </TouchableOpacity>
            </View>      
        </TouchableOpacity>
        )
    }

    function PressXoa(item:danhba){
      Alert.alert("Xác nhận xóa",
                `ban muon xoa${item.name}`,
                [
                  {
                    text:'huy',
                    style:'cancel'
                  },
                  {
                    text:'xac nhan',
                    style:'destructive',
                    onPress:()=>Delete(item)
                  }
                ]
              )
    }

    async function Add(){
        if(!db) return
        await db?.runAsync('INSERT INTO DanhBa (name, phone, email) VALUES (?, ?, ?);',
            [nameAdd, phoneAdd,emailAdd])
        setAdd(false)
        const danhba_t:danhba[]= await db?.getAllAsync('SELECT * FROM DanhBa')
        setDanhBa(danhba_t)

    }

    async function Favorite(item:danhba){
      if(!db) return
      if(item.favorite===0)
        await db?.runAsync('UPDATE DanhBa SET favorite = ? WHERE id = ?', [1, item.id]);
      else
        await db?.runAsync('UPDATE DanhBa SET favorite = ? WHERE id = ?', [0, item.id]);
        const danhba_t:danhba[]= await db?.getAllAsync('SELECT * FROM DanhBa')
        setDanhBa(danhba_t)

    }//runAsync không bao giờ chấp nhận giá trị đầu vào là null, underfined, phỉa là giá trị có thật, 

    async function Edit(){
      if(!db) return
         await db?.runAsync('UPDATE DanhBa SET name = ?, phone = ?, email = ? WHERE id = ?', 
           [itemEdit?.name??'', itemEdit?.phone??'', itemEdit?.email??'', itemEdit?.id??0]);
      setEdit(false)
          const danhba_t:danhba[]= await db?.getAllAsync('SELECT * FROM DanhBa')
          setDanhBa(danhba_t)

    }

    async function Delete(item:danhba){
      if(!db || !item.id) return
      await db.runAsync('DELETE FROM DanhBa WHERE id = ?', [item?.id]);
      const danhba_t:danhba[] = await db.getAllAsync('SELECT * FROM DanhBa')
      setDanhBa(danhba_t)
    }
  return (
<SafeAreaProvider>
    <SafeAreaView>
        <Text>SImple COntaact</Text>
        <FlatList
        data={danhBa}
        keyExtractor={(item,index)=>item.id.toString()??index.toString()}
        renderItem={({item})=>Hienthi(item)}
        />

        <TouchableOpacity style={styles.nut} onPress={()=>setAdd(true)}>
            <Text> them lien he </Text>
        </TouchableOpacity>
        <Modal visible={add} onRequestClose={()=>setAdd(false)}
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
        <Modal visible={edit} onRequestClose={()=>setEdit(false)}>
          <View>
            <Text> chienh sua lien he</Text>
                <TextInput style={styles.input} value={itemEdit?.name} 
                onChangeText={value=>setItemEdit(pre=>{
                  return {...pre,name:value};
                  })}></TextInput>
                <TextInput style={styles.input} value={itemEdit?.phone}
                onChangeText={(value)=>setItemEdit(pre=>({...pre,phone:value}))}
                ></TextInput>
                <TextInput style={styles.input} value={itemEdit?.email}
                onChangeText={(value)=>setItemEdit(pre=>({...pre,email:value}))}
                ></TextInput>

                <TouchableOpacity style={styles.nut}
                onPress={()=>Edit()}>
                    <Text> Edit</Text>
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
