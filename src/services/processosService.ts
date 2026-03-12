import { collection, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import type { Processo } from "@/types"

const CACHE_KEY = "processos_cache"
const META_KEY = "processos_meta"

export async function getProcessos(): Promise<Processo[]> {

  const cache = localStorage.getItem(CACHE_KEY)
  const meta = localStorage.getItem(META_KEY)

  const metaDoc = await getDoc(doc(db, "controle", "sedur"))

  const ultimaAtualizacao = metaDoc.data()?.ultima_atualizacao

  if (cache && meta) {

    const parsedMeta = JSON.parse(meta)

    if (parsedMeta.ultima_atualizacao === ultimaAtualizacao) {
      return JSON.parse(cache)
    }

  }

  const snapshot = await getDocs(collection(db, "processos"))

  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Processo, "id">)
  }))

  localStorage.setItem(CACHE_KEY, JSON.stringify(data))

  localStorage.setItem(META_KEY, JSON.stringify({
    ultima_atualizacao: ultimaAtualizacao
  }))

  return data
}