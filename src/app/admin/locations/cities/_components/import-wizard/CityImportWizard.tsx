"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search, MapPin, AlertCircle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { previewCityImportAction, executeCityImportAction } from "@/modules/locations/actions/city-import.actions"

type PreviewItem = {
  name: string
  state?: string
  country?: string
  confidence: number
  provider: string
  action: "IMPORT" | "SKIP" | "CONFLICT"
  reason?: string
}

export function CityImportWizard() {
  const router = useRouter()
  
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [provider, setProvider] = useState("OSM_NOMINATIM")
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([])
  
  const handleFetchPreview = async () => {
    if (!query) {
      toast.error("Please enter a city name to search.")
      return
    }
    
    setLoading(true)
    try {
      const res = await previewCityImportAction(query, provider as any)
      if (res.success) {
        setPreviewItems(res.data || [])
        setStep(2)
      } else {
        toast.error(res.error || "Preview Failed")
      }
    } catch (error: any) {
      toast.error(error.message || "Error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleCommitImport = async () => {
    const itemsToImport = previewItems.filter(i => i.action === "IMPORT")
    if (itemsToImport.length === 0) {
      toast.error("Nothing to import. All items are skipped or conflicted.")
      return
    }

    setLoading(true)
    try {
      const res = await executeCityImportAction(previewItems)
      if (res.success && res.data) {
        toast.success(`Imported ${res.data.imported} cities. Skipped ${res.data.skipped}.`)
        router.push("/admin/locations/cities")
      } else {
        toast.error(res.error || "Import Failed")
      }
    } catch (error: any) {
      toast.error(error.message || "Error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step {step}: {step === 1 ? "Search City" : "Preview & Import"}</CardTitle>
        <CardDescription>
          {step === 1 
            ? "Search for a top-level administrative city using a free external API." 
            : "Review the matching cities before saving them to your local database."}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Search Query</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g. Bangalore" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFetchPreview()}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Location Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OSM_NOMINATIM">OpenStreetMap Nominatim (Free)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-muted-foreground">Found {previewItems.length} results</h3>
              <Badge variant="outline" className="bg-primary/5 text-primary">
                {previewItems.filter(i => i.action === "IMPORT").length} to import
              </Badge>
            </div>

            <div className="h-[400px] overflow-auto rounded-md border p-4">
              <div className="space-y-4">
                {previewItems.length === 0 && (
                  <div className="text-center p-8 text-muted-foreground">
                    No results found for &quot;{query}&quot;.
                  </div>
                )}
                {previewItems.map((item, index) => (
                  <div key={index} className="flex flex-col gap-2 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{item.name}</span>
                        {item.state && <span className="text-sm text-muted-foreground">, {item.state}</span>}
                        {item.country && <span className="text-sm text-muted-foreground">, {item.country}</span>}
                      </div>
                      
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.confidence}% Match
                        </Badge>
                        {item.action === "IMPORT" ? (
                          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Ready
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-500/20">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            {item.action}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {item.reason && (
                      <p className="text-xs text-orange-600 pl-6">{item.reason}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-6">
        {step === 2 && (
          <Button variant="ghost" onClick={() => setStep(1)} disabled={loading}>
            Back to Search
          </Button>
        )}
        <div className="flex-1" />
        {step === 1 ? (
          <Button onClick={handleFetchPreview} disabled={loading || !query}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Search City
          </Button>
        ) : (
          <Button onClick={handleCommitImport} disabled={loading || previewItems.filter(i => i.action === "IMPORT").length === 0}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
            Save Cities to Database
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
