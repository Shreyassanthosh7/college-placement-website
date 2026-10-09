import { useState } from 'react'
import { useSettings } from '../hooks/useSettings'
import Reveal from '../components/Reveal'

export default function Contact() {
  const { settings } = useSettings()
  const [copyMessage, setCopyMessage] = useState('')
  const email = settings.email?.trim() ?? ''
  const phone = settings.phone?.trim() ?? ''
  const address = settings.address?.trim() ?? ''
  const secondAddress = settings.secondAddress?.trim() ?? ''
  const officeHours = settings.officeHours?.trim() ?? ''
  const placementCellName = settings.placementCellName?.trim() || 'Placement Cell'
  const collegeName = settings.collegeName?.trim()
  const mailtoHref = email ? `mailto:${email}` : null
  const gmailComposeHref = email
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`
    : null
  const phoneHref = phone ? `tel:${phone.replace(/[^+\d]/g, '')}` : null
  const primaryDirections = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : null
  const secondaryDirections = secondAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(secondAddress)}`
    : null
  const socialLinks = [
    { label: 'YouTube', href: settings.social.youtube },
    { label: 'Twitter / X', href: settings.social.twitter },
    { label: 'Instagram', href: settings.social.instagram },
    { label: 'College Website', href: settings.collegeWebsite },
  ].filter((link) => link.href?.trim())
  const actionClass = 'inline-flex min-h-11 items-center justify-center rounded-full border px-4 text-sm font-semibold transition-colors hover:bg-card/40 focus-visible:outline focus-visible:outline-2'

  async function copyEmail() {
    if (!email) return

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email)
      } else {
        throw new Error('Clipboard API unavailable')
      }
      setCopyMessage('Email address copied.')
    } catch {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = email
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        let copied = false
        try {
          document.body.appendChild(textarea)
          textarea.focus()
          textarea.select()
          copied = document.execCommand('copy')
        } finally {
          textarea.remove()
        }
        if (!copied) throw new Error('Copy command failed')
        setCopyMessage('Email address copied.')
      } catch {
        setCopyMessage('Copy failed. Please select and copy the email address above.')
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Reveal>
      <h1 className="font-display text-3xl font-bold mb-2">Contact Placement Cell</h1>
      <p className="text-muted-foreground max-w-2xl mb-8">
        Reach out to the Placement Cell for placement-related queries.
      </p>

      <div className="glass rounded-xl divide-y divide-border">
        <div className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Placement Cell</p>
          <p className="font-medium">{placementCellName}</p>
          {collegeName && <p className="text-sm text-muted-foreground">{collegeName}</p>}
        </div>
        {email && <div className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Email</p>
          <a href={mailtoHref} className="inline-flex min-h-11 items-center hover:underline focus-visible:outline focus-visible:outline-2" style={{ color: 'var(--color-primary)' }}>
            {email}
          </a>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={gmailComposeHref} target="_blank" rel="noopener noreferrer" className={actionClass} style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
              Email the Placement Cell
            </a>
            <button type="button" onClick={copyEmail} className={actionClass} style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
              Copy email address
            </button>
          </div>
          {copyMessage && (
            <p className="mt-2 text-sm text-muted-foreground" role="status" aria-live="polite">
              {copyMessage}
            </p>
          )}
        </div>}
        {phone && <div className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Phone</p>
          <a href={phoneHref} className="inline-flex min-h-11 items-center hover:underline focus-visible:outline focus-visible:outline-2" style={{ color: 'var(--color-primary)' }}>{phone}</a>
          <div className="mt-3">
            <a href={phoneHref} className={actionClass} style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
              Call the Placement Cell
            </a>
          </div>
        </div>}
        {(address || secondAddress) && <div className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Address</p>
          {address && <p className="font-medium">{address}</p>}
          {primaryDirections && address && (
            <a href={primaryDirections} target="_blank" rel="noopener noreferrer" className={`${actionClass} mt-3`} style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
              Directions to primary campus
            </a>
          )}
          {secondAddress && <p className="font-medium mt-4">{secondAddress}</p>}
          {secondaryDirections && (
            <a href={secondaryDirections} target="_blank" rel="noopener noreferrer" className={`${actionClass} mt-3`} style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
              Directions to second campus
            </a>
          )}
        </div>}
        {officeHours && <div className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Office Hours</p>
          <p className="font-medium">{officeHours}</p>
        </div>}
        {socialLinks.length > 0 && <div className="p-5">
          <p className="text-xs text-muted-foreground mb-2">Connect</p>
          <div className="flex flex-wrap gap-3 text-sm">
            {socialLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center px-2 hover:underline transition-colors duration-200 focus-visible:outline focus-visible:outline-2" style={{ color: 'var(--color-primary)' }}>{link.label}</a>)}
          </div>
        </div>}
      </div>
      </Reveal>
    </div>
  )
}
