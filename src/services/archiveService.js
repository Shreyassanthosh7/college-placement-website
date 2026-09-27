import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { mockSettings } from '../data/mockData'

const ARCHIVE_COLLECTION = 'archive'
const SETTINGS_REF = doc(db, 'settings', 'general')
const SOURCE_COLLECTIONS = {
  company: 'companies',
  drive: 'placementDrives',
  announcement: 'announcements',
  placement: 'placements',
}

function createArchiveRef() {
  return doc(collection(db, ARCHIVE_COLLECTION))
}

function getTeamMembers(settings) {
  const members = Array.isArray(settings?.teamMembers) ? settings.teamMembers : mockSettings.teamMembers
  return members.map((member, index) => ({
    id: member?.id || `team-member-${index + 1}`,
    name: typeof member?.name === 'string' ? member.name : '',
    designation: typeof member?.designation === 'string' ? member.designation : '',
  }))
}

function labelFor(entityType, record) {
  if (entityType === 'company') return record.name || 'Company'
  if (entityType === 'drive') return `${record.companyName || 'Placement'} drive`
  if (entityType === 'announcement') return record.title || 'Announcement'
  if (entityType === 'placement') return record.studentName || 'Placement record'
  if (entityType === 'team') return record.name || 'Team member'
  return 'Archived item'
}

function validateEntityType(entityType) {
  if (entityType !== 'team' && !SOURCE_COLLECTIONS[entityType]) {
    throw new Error('unsupported-archive-type')
  }
}

export async function getArchivedRecords() {
  const snapshot = await getDocs(query(collection(db, ARCHIVE_COLLECTION), orderBy('archivedAt', 'desc')))
  return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }))
}

export async function archiveRecord(entityType, id) {
  validateEntityType(entityType)
  const sourceCollection = SOURCE_COLLECTIONS[entityType]
  if (!sourceCollection) throw new Error('team-member-requires-team-archive')

  const sourceRef = doc(db, sourceCollection, id)
  const archiveRef = createArchiveRef()
  await runTransaction(db, async (transaction) => {
    const sourceSnapshot = await transaction.get(sourceRef)
    if (!sourceSnapshot.exists()) throw new Error('record-not-found')

    const record = sourceSnapshot.data()
    transaction.set(archiveRef, {
      entityType,
      originalId: id,
      label: labelFor(entityType, record),
      record,
      archivedAt: serverTimestamp(),
    })
    transaction.delete(sourceRef)

    if (entityType === 'placement') {
      transaction.set(SETTINGS_REF, {
        studentsPlaced: increment(-1),
        updatedAt: serverTimestamp(),
      }, { merge: true })
    }
  })
}

export async function archiveTeamMember(member) {
  const archiveRef = createArchiveRef()
  await runTransaction(db, async (transaction) => {
    const settingsSnapshot = await transaction.get(SETTINGS_REF)
    const members = getTeamMembers(settingsSnapshot.exists() ? settingsSnapshot.data() : null)
    const memberIndex = members.findIndex((existing) => existing.id === member.id)
    if (memberIndex < 0) throw new Error('record-not-found')

    const [record] = members.splice(memberIndex, 1)
    transaction.set(SETTINGS_REF, {
      teamMembers: members,
      updatedAt: serverTimestamp(),
    }, { merge: true })
    transaction.set(archiveRef, {
      entityType: 'team',
      originalId: record.id,
      label: labelFor('team', record),
      record,
      archivedAt: serverTimestamp(),
    })
  })
}

export async function restoreArchivedRecord(archiveId) {
  const archiveRef = doc(db, ARCHIVE_COLLECTION, archiveId)
  await runTransaction(db, async (transaction) => {
    const archiveSnapshot = await transaction.get(archiveRef)
    if (!archiveSnapshot.exists()) throw new Error('archive-item-not-found')
    const archived = archiveSnapshot.data()
    validateEntityType(archived.entityType)

    if (archived.entityType === 'team') {
      const settingsSnapshot = await transaction.get(SETTINGS_REF)
      const settings = settingsSnapshot.exists() ? settingsSnapshot.data() : null
      const members = getTeamMembers(settings)
      if (members.some((member) => member.id === archived.originalId)) {
        throw new Error('team-member-already-exists')
      }
      transaction.set(SETTINGS_REF, {
        teamMembers: [...members, archived.record],
        updatedAt: serverTimestamp(),
      }, { merge: true })
    } else {
      const targetRef = doc(db, SOURCE_COLLECTIONS[archived.entityType], archived.originalId)
      const targetSnapshot = await transaction.get(targetRef)
      if (targetSnapshot.exists()) throw new Error('record-already-exists')
      transaction.set(targetRef, archived.record)

      if (archived.entityType === 'placement') {
        transaction.set(SETTINGS_REF, {
          studentsPlaced: increment(1),
          updatedAt: serverTimestamp(),
        }, { merge: true })
      }
    }

    transaction.delete(archiveRef)
  })
}

export function permanentlyDeleteArchivedRecord(archiveId) {
  return deleteDoc(doc(db, ARCHIVE_COLLECTION, archiveId))
}
