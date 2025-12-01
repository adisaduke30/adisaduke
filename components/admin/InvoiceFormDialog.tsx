'use client'

import { useState, useTransition } from 'react'
import { createInvoice } from '@/app/actions/invoices'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText, Plus, X, Loader2, DollarSign } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface LineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
}

interface Project {
  id: string
  name: string
  client_id: string
}

interface InvoiceFormDialogProps {
  projects: Project[]
  preselectedProjectId?: string
  trigger?: React.ReactNode
}

export function InvoiceFormDialog({ projects, preselectedProjectId, trigger }: InvoiceFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()

  const [projectId, setProjectId] = useState(preselectedProjectId || '')
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, unit_price: 0 }
  ])
  const [depositPercentage, setDepositPercentage] = useState('0')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), description: '', quantity: 1, unit_price: 0 }
    ])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id))
    }
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
  }

  const calculateDeposit = () => {
    const subtotal = calculateSubtotal()
    const percentage = parseFloat(depositPercentage) || 0
    return (subtotal * percentage) / 100
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a project',
        variant: 'destructive',
      })
      return
    }

    const validItems = lineItems.filter(item => item.description.trim() && item.unit_price > 0)

    if (validItems.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one line item with a description and price',
        variant: 'destructive',
      })
      return
    }

    startTransition(async () => {
      const result = await createInvoice({
        project_id: projectId,
        line_items: validItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        deposit_percentage: depositPercentage ? parseFloat(depositPercentage) : undefined,
        due_date: dueDate || undefined,
        notes: notes || undefined,
      })

      if (result.success) {
        toast({
          title: 'Invoice Created',
          description: 'Invoice has been created and sent to the client',
        })

        // Reset form
        setProjectId(preselectedProjectId || '')
        setLineItems([{ id: '1', description: '', quantity: 1, unit_price: 0 }])
        setDepositPercentage('0')
        setDueDate('')
        setNotes('')
        setOpen(false)

        // Refresh the page
        router.refresh()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create invoice',
          variant: 'destructive',
        })
      }
    })
  }

  const subtotal = calculateSubtotal()
  const deposit = calculateDeposit()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <DialogDescription>
            Create and send an invoice to your client
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project">Project *</Label>
            <Select
              value={projectId}
              onValueChange={setProjectId}
              disabled={isPending || !!preselectedProjectId}
            >
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Line Items *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLineItem}
                disabled={isPending}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <div key={item.id} className="p-4 border border-border rounded-lg space-y-3 bg-accent/20">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label htmlFor={`description-${item.id}`} className="text-xs">
                          Description
                        </Label>
                        <Input
                          id={`description-${item.id}`}
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          placeholder="Video editing services..."
                          className="bg-background/50 border-border/50"
                          disabled={isPending}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`quantity-${item.id}`} className="text-xs">
                            Quantity
                          </Label>
                          <Input
                            id={`quantity-${item.id}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            className="bg-background/50 border-border/50"
                            disabled={isPending}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor={`price-${item.id}`} className="text-xs">
                            Unit Price ($)
                          </Label>
                          <Input
                            id={`price-${item.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unit_price}
                            onChange={(e) => updateLineItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className="bg-background/50 border-border/50"
                            disabled={isPending}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-medium">
                          ${(item.quantity * item.unit_price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {lineItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLineItem(item.id)}
                        disabled={isPending}
                        className="mt-6"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deposit">Deposit Percentage (%)</Label>
              <Input
                id="deposit"
                type="number"
                min="0"
                max="100"
                value={depositPercentage}
                onChange={(e) => setDepositPercentage(e.target.value)}
                placeholder="0"
                className="bg-background/50 border-border/50"
                disabled={isPending}
              />
              {parseFloat(depositPercentage) > 0 && (
                <p className="text-xs text-muted-foreground">
                  Deposit: ${deposit.toFixed(2)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-background/50 border-border/50"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional invoice notes or terms..."
              rows={3}
              className="bg-background/50 border-border/50 resize-none"
              disabled={isPending}
            />
          </div>

          {/* Invoice Summary */}
          <div className="p-4 bg-accent/30 rounded-lg border border-border space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            {parseFloat(depositPercentage) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Deposit ({depositPercentage}%):
                </span>
                <span className="font-medium text-primary">${deposit.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">${subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !projectId}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Invoice...
                </>
              ) : (
                <>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Create & Send Invoice
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
