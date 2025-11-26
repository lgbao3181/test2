import { taoMoi } from '@/db';
import { SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function ModalScreen() {
    const [db,setDb]=useState<SQLiteDatabase|null>(null)
    let dulieu:object[]
    useEffect(()=>{
         async function taoDb(){
            const db_t= await taoMoi()
            setDb(db_t)
        }
        taoDb()
    },[])
  return (
<SafeAreaProvider>
    <SafeAreaView>
        <Text>SImple COntaact</Text>
        <Text>{db?.toString()}</Text>
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
