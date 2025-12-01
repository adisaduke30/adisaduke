import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Hr,
} from '@react-email/components'

interface ContactEmailProps {
  name: string
  email: string
  message: string
}

export function ContactEmail({ name, email, message }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Submission</Heading>

          <Text style={text}>
            You have received a new message from your website contact form:
          </Text>

          <Section style={infoSection}>
            <Text style={label}>From:</Text>
            <Text style={value}>{name}</Text>

            <Text style={label}>Email:</Text>
            <Text style={value}>{email}</Text>

            <Text style={label}>Message:</Text>
            <Text style={messageBox}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Duke Studios
            <br />
            Professional Cinematography Services
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
}

const h1 = {
  color: '#000000',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  padding: '0',
}

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const infoSection = {
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const label = {
  color: '#666666',
  fontSize: '14px',
  fontWeight: '600',
  margin: '16px 0 4px 0',
}

const value = {
  color: '#000000',
  fontSize: '16px',
  margin: '0 0 16px 0',
}

const messageBox = {
  backgroundColor: '#ffffff',
  border: '1px solid #dddddd',
  borderRadius: '4px',
  color: '#000000',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '16px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}

const hr = {
  borderColor: '#dddddd',
  margin: '32px 0',
}

const footer = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
}
