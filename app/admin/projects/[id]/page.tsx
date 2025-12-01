import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusUpdater } from '@/components/admin/StatusUpdater'
import { DownloadFileButton } from '@/components/DownloadFileButton'
import { MessageForm } from '@/components/forms/MessageForm'
import { FileUploadDialog } from '@/components/admin/FileUploadDialog'
import { InvoiceFormDialog } from '@/components/admin/InvoiceFormDialog'
import {
  ArrowLeft,
  Calendar,
  FileText,
  MessageSquare,
  User,
  Mail,
  Building,
} from 'lucide-react'

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  pre_production: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  shooting: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  editing: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  review: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
}

const statusLabels = {
  pending: 'Pending',
  pre_production: 'Pre-Production',
  shooting: 'Shooting',
  editing: 'Editing',
  review: 'In Review',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export default async function AdminProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  const { data: project } = await supabase
    .from('projects')
    .select(`
      *,
      users!projects_client_id_fkey(id, name, email, company, phone)
    `)
    .eq('id', id)
    .single()

  if (!project) {
    redirect('/admin/projects')
  }

  const { data: files } = await supabase
    .from('project_files')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  const { data: messages } = await supabase
    .from('project_messages')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: true })

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  const client = project.users as any

  return (
    <DashboardLayout user={profile}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <p className="text-muted-foreground">Project management and details</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={`${statusColors[project.status as keyof typeof statusColors]} text-sm`}
            >
              {statusLabels[project.status as keyof typeof statusLabels]}
            </Badge>
            <StatusUpdater projectId={project.id} currentStatus={project.status} />
          </div>
        </div>

        {/* Client Info Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{client?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{client?.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-sm text-muted-foreground">{client?.company || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{client?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Project Type</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {project.project_type?.replace('_', ' ') || 'N/A'}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deadline</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {project.deadline
                  ? new Date(project.deadline).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'TBD'}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deliverables</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{files?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {files?.filter(f => f.is_final).length || 0} final
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {messages?.filter(m => m.sender_id !== user.id && !m.read_at).length || 0} unread
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="files">Files & Deliverables</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {project.description || 'No description provided'}
                </p>
                <Separator />
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.updated_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  {project.completed_at && (
                    <div>
                      <p className="text-sm font-medium mb-1">Completed</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(project.completed_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Project Files</CardTitle>
                  <CardDescription>Deliverables and project assets</CardDescription>
                </div>
                <FileUploadDialog projectId={project.id} />
              </CardHeader>
              <CardContent>
                {!files || files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <FileText className="h-12 w-12 mb-4" />
                    <p>No files uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{file.file_name}</p>
                              {file.is_final && (
                                <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
                                  Final
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {file.file_type} • {file.file_size ? `${(file.file_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                              {file.version && ` • v${file.version}`}
                            </p>
                            {file.notes && (
                              <p className="text-xs text-muted-foreground mt-1">{file.notes}</p>
                            )}
                          </div>
                        </div>
                        <DownloadFileButton fileId={file.id} fileName={file.file_name} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Project Communication</CardTitle>
                <CardDescription>Messages with {client?.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!messages || messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mb-4" />
                    <p>No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {messages.map((message) => {
                      const isOwn = message.sender_id === user.id
                      return (
                        <div key={message.id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {isOwn ? 'DS' : client?.name?.charAt(0) || 'C'}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`flex-1 space-y-1 ${isOwn ? 'items-end' : ''}`}>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">
                                {isOwn ? 'Duke Studios' : client?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(message.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <div
                              className={`rounded-lg p-3 max-w-md ${
                                isOwn
                                  ? 'bg-primary/10 border border-primary/20'
                                  : 'bg-muted border border-border'
                              }`}
                            >
                              <p className="text-sm">{message.body}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-4">Send a Message</h4>
                  <MessageForm projectId={id} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>Project billing and payments</CardDescription>
                </div>
                <InvoiceFormDialog
                  projects={[{ id: project.id, name: project.name, client_id: project.client_id }]}
                  preselectedProjectId={project.id}
                />
              </CardHeader>
              <CardContent>
                {!invoices || invoices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <FileText className="h-12 w-12 mb-4" />
                    <p>No invoices yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {invoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50"
                      >
                        <div>
                          <p className="font-medium">Invoice #{invoice.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            ${(invoice.amount / 100).toFixed(2)} • {invoice.status}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
