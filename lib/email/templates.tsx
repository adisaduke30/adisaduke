import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://duke-studios.vercel.app'

interface EmailLayoutProps {
  preview: string
  children: React.ReactNode
}

function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={heading}>Duke Studios</Heading>
            <Text style={tagline}>Professional Video Production</Text>
          </Section>
          {children}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Duke Studios - Bringing your vision to life
            </Text>
            <Text style={footerText}>
              Need help? Reply to this email or visit{' '}
              <Link href={baseUrl} style={link}>
                {baseUrl}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Welcome Email
export function WelcomeEmail({ name, verifyUrl }: { name: string; verifyUrl: string }) {
  return (
    <EmailLayout preview="Welcome to Duke Studios">
      <Section style={content}>
        <Heading style={h1}>Welcome to Duke Studios!</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          Thank you for joining Duke Studios. We are excited to work with you on your next video production project.
        </Text>
        <Text style={text}>
          To get started, please verify your email address by clicking the button below:
        </Text>
        <Button style={button} href={verifyUrl}>
          Verify Email Address
        </Button>
        <Text style={text}>
          Or copy and paste this URL into your browser:
        </Text>
        <Text style={code}>{verifyUrl}</Text>
        <Text style={text}>
          Once verified, you can book consultations, view your projects, and communicate with our team.
        </Text>
      </Section>
    </EmailLayout>
  )
}

// Booking Confirmed Email
export function BookingConfirmedEmail({
  name,
  date,
  time,
  type,
  bookingUrl,
}: {
  name: string
  date: string
  time: string
  type: string
  bookingUrl: string
}) {
  return (
    <EmailLayout preview="Your booking has been confirmed">
      <Section style={content}>
        <Heading style={h1}>Booking Confirmed</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          Your booking request has been confirmed by Duke Studios.
        </Text>
        <Section style={infoBox}>
          <Text style={infoLabel}>Type:</Text>
          <Text style={infoValue}>{type}</Text>
          <Text style={infoLabel}>Date:</Text>
          <Text style={infoValue}>{date}</Text>
          <Text style={infoLabel}>Time:</Text>
          <Text style={infoValue}>{time}</Text>
        </Section>
        <Button style={button} href={bookingUrl}>
          View Booking Details
        </Button>
        <Text style={text}>
          We look forward to working with you. If you need to make any changes, please contact us as soon as possible.
        </Text>
      </Section>
    </EmailLayout>
  )
}

// Booking Declined Email
export function BookingDeclinedEmail({
  name,
  date,
  time,
  type,
  reason,
}: {
  name: string
  date: string
  time: string
  type: string
  reason?: string
}) {
  return (
    <EmailLayout preview="Booking request update">
      <Section style={content}>
        <Heading style={h1}>Booking Request Update</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          We regret to inform you that your booking request for {date} at {time} could not be confirmed.
        </Text>
        {reason && (
          <Section style={infoBox}>
            <Text style={infoLabel}>Reason:</Text>
            <Text style={infoValue}>{reason}</Text>
          </Section>
        )}
        <Text style={text}>
          Please feel free to submit another booking request for a different time, or contact us directly to discuss alternative options.
        </Text>
        <Button style={button} href={`${baseUrl}/bookings`}>
          Make New Booking
        </Button>
      </Section>
    </EmailLayout>
  )
}

// New Invoice Email
export function NewInvoiceEmail({
  name,
  invoiceNumber,
  amount,
  dueDate,
  projectName,
  invoiceUrl,
}: {
  name: string
  invoiceNumber: string
  amount: string
  dueDate: string
  projectName: string
  invoiceUrl: string
}) {
  return (
    <EmailLayout preview={`New invoice ${invoiceNumber} - ${amount}`}>
      <Section style={content}>
        <Heading style={h1}>New Invoice</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          You have received a new invoice from Duke Studios for {projectName}.
        </Text>
        <Section style={infoBox}>
          <Text style={infoLabel}>Invoice Number:</Text>
          <Text style={infoValue}>{invoiceNumber}</Text>
          <Text style={infoLabel}>Amount:</Text>
          <Text style={infoValue}>{amount}</Text>
          <Text style={infoLabel}>Due Date:</Text>
          <Text style={infoValue}>{dueDate}</Text>
        </Section>
        <Button style={button} href={invoiceUrl}>
          View and Pay Invoice
        </Button>
        <Text style={text}>
          You can pay securely online using a credit or debit card.
        </Text>
      </Section>
    </EmailLayout>
  )
}

// Payment Received Email
export function PaymentReceivedEmail({
  name,
  amount,
  invoiceNumber,
  projectName,
  isDeposit,
  invoiceUrl,
}: {
  name: string
  amount: string
  invoiceNumber: string
  projectName: string
  isDeposit: boolean
  invoiceUrl: string
}) {
  return (
    <EmailLayout preview={`Payment received - ${amount}`}>
      <Section style={content}>
        <Heading style={h1}>Payment Received</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          Thank you! We have successfully received your {isDeposit ? 'deposit' : 'payment'} for {projectName}.
        </Text>
        <Section style={infoBox}>
          <Text style={infoLabel}>Invoice Number:</Text>
          <Text style={infoValue}>{invoiceNumber}</Text>
          <Text style={infoLabel}>Amount Paid:</Text>
          <Text style={infoValue}>{amount}</Text>
          <Text style={infoLabel}>Payment Type:</Text>
          <Text style={infoValue}>{isDeposit ? 'Deposit' : 'Full Payment'}</Text>
        </Section>
        <Button style={button} href={invoiceUrl}>
          View Receipt
        </Button>
        <Text style={text}>
          A receipt has been sent to your email. If you have any questions, please do not hesitate to contact us.
        </Text>
      </Section>
    </EmailLayout>
  )
}

// New Message Email
export function NewMessageEmail({
  name,
  senderName,
  messagePreview,
  projectName,
  messageUrl,
}: {
  name: string
  senderName: string
  messagePreview: string
  projectName: string
  messageUrl: string
}) {
  return (
    <EmailLayout preview={`New message from ${senderName}`}>
      <Section style={content}>
        <Heading style={h1}>New Message</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          You have a new message from {senderName} regarding {projectName}.
        </Text>
        <Section style={messageBox}>
          <Text style={messageText}>{messagePreview}</Text>
        </Section>
        <Button style={button} href={messageUrl}>
          View and Reply
        </Button>
        <Text style={text}>
          Log in to your dashboard to view the full conversation and respond.
        </Text>
      </Section>
    </EmailLayout>
  )
}

// Project Status Update Email
export function ProjectStatusEmail({
  name,
  projectName,
  oldStatus,
  newStatus,
  projectUrl,
}: {
  name: string
  projectName: string
  oldStatus: string
  newStatus: string
  projectUrl: string
}) {
  return (
    <EmailLayout preview={`Project update: ${projectName}`}>
      <Section style={content}>
        <Heading style={h1}>Project Status Update</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          Your project {projectName} has been updated.
        </Text>
        <Section style={infoBox}>
          <Text style={infoLabel}>Previous Status:</Text>
          <Text style={infoValue}>{oldStatus}</Text>
          <Text style={infoLabel}>New Status:</Text>
          <Text style={infoValue}>{newStatus}</Text>
        </Section>
        <Button style={button} href={projectUrl}>
          View Project Details
        </Button>
        <Text style={text}>
          Check your project dashboard for the latest updates and deliverables.
        </Text>
      </Section>
    </EmailLayout>
  )
}

// New File Uploaded Email
export function NewFileEmail({
  name,
  projectName,
  fileName,
  isFinal,
  projectUrl,
}: {
  name: string
  projectName: string
  fileName: string
  isFinal: boolean
  projectUrl: string
}) {
  return (
    <EmailLayout preview={`New ${isFinal ? 'final' : ''} file uploaded`}>
      <Section style={content}>
        <Heading style={h1}>{isFinal ? 'Final Deliverable' : 'New File'} Uploaded</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          A new {isFinal ? 'final deliverable' : 'file'} has been uploaded to your project {projectName}.
        </Text>
        <Section style={infoBox}>
          <Text style={infoLabel}>File Name:</Text>
          <Text style={infoValue}>{fileName}</Text>
          {isFinal && (
            <>
              <Text style={infoLabel}>Type:</Text>
              <Text style={infoValue}>Final Deliverable</Text>
            </>
          )}
        </Section>
        <Button style={button} href={projectUrl}>
          Download File
        </Button>
        <Text style={text}>
          Log in to your dashboard to view and download the file.
        </Text>
      </Section>
    </EmailLayout>
  )
}

// Password Reset Email
export function PasswordResetEmail({
  name,
  resetUrl,
}: {
  name: string
  resetUrl: string
}) {
  return (
    <EmailLayout preview="Reset your password">
      <Section style={content}>
        <Heading style={h1}>Reset Your Password</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          You recently requested to reset your password for your Duke Studios account. Click the button below to reset it.
        </Text>
        <Button style={button} href={resetUrl}>
          Reset Password
        </Button>
        <Text style={text}>
          Or copy and paste this URL into your browser:
        </Text>
        <Text style={code}>{resetUrl}</Text>
        <Text style={text}>
          If you did not request a password reset, please ignore this email or contact us if you have concerns.
        </Text>
        <Text style={text}>
          This link will expire in 1 hour.
        </Text>
      </Section>
    </EmailLayout>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const header = {
  padding: '32px 24px',
  textAlign: 'center' as const,
  backgroundColor: '#000000',
}

const heading = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 8px',
}

const tagline = {
  fontSize: '14px',
  color: '#cccccc',
  margin: '0',
}

const content = {
  padding: '0 24px',
}

const h1 = {
  color: '#000000',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
}

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const button = {
  backgroundColor: '#000000',
  borderRadius: '5px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px',
  margin: '24px 0',
}

const infoBox = {
  backgroundColor: '#f6f9fc',
  borderRadius: '5px',
  padding: '16px',
  margin: '24px 0',
}

const infoLabel = {
  color: '#8898aa',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  margin: '12px 0 4px',
}

const infoValue = {
  color: '#525f7f',
  fontSize: '16px',
  margin: '0 0 12px',
}

const messageBox = {
  backgroundColor: '#f6f9fc',
  borderLeft: '4px solid #000000',
  borderRadius: '5px',
  padding: '16px',
  margin: '24px 0',
}

const messageText = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '20px',
  fontStyle: 'italic' as const,
  margin: '0',
}

const code = {
  color: '#525f7f',
  fontSize: '14px',
  backgroundColor: '#f6f9fc',
  padding: '8px 12px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  margin: '16px 0',
  display: 'block',
  wordBreak: 'break-all' as const,
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
}

const footer = {
  padding: '0 24px',
}

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '8px 0',
  textAlign: 'center' as const,
}

const link = {
  color: '#000000',
  textDecoration: 'underline',
}
