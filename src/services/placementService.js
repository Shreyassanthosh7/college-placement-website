import {
  collection,
  doc,
  getDocs,
  increment,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const COLLECTION = 'placements'
const SETTINGS_REF = doc(db, 'settings', 'general')

export async function getAllPlacements() {
  const snapshot = await getDocs(collection(db, COLLECTION))
  return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }))
}

export async function createPlacement(data) {
  const placementRef = doc(collection(db, COLLECTION))
  const batch = writeBatch(db)
  batch.set(placementRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  batch.set(SETTINGS_REF, {
    studentsPlaced: increment(1),
    updatedAt: serverTimestamp(),
  }, { merge: true })
  await batch.commit()
  return placementRef.id
}

export function updatePlacement(id, data) {
  return updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}
