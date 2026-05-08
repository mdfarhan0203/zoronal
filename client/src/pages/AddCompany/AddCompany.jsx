import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import api from "@/services/api.js"

const defaultForm = {
  name: "",
  city: "",
  description: "",
  state: "",
  country: "India",
  website: "",
  email: "",
  phone: "",
  industry: "",
  logoText: "",
}

const AddCompany = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(defaultForm)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setSubmitting(true)
      setError("")
      const response = await api.createCompany(formData)
      navigate(`/company/${response.data._id}`)
    } catch (err) {
      setError(err.message || "Failed to create company")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto min-h-[calc(100vh-90px)] w-full max-w-3xl px-4 py-6 md:py-10">
      <div className="rounded-xl border bg-white p-5 shadow-sm md:p-7">
        <h1 className="text-2xl font-semibold">Add Company</h1>
        <p className="mt-1 text-sm text-muted-foreground">Submit company information. Added companies are listed on home page.</p>
        {error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              Company Name
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="rounded-md border border-border px-3 py-2"
                placeholder="Company name"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              City / Location
              <input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="rounded-md border border-border px-3 py-2"
                placeholder="Indore, Madhya Pradesh, India"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm">
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="rounded-md border border-border px-3 py-2"
              placeholder="What does this company do?"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm">
              State
              <input
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="rounded-md border border-border px-3 py-2"
                placeholder="Madhya Pradesh"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              Country
              <input
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="rounded-md border border-border px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              Logo Text
              <input
                name="logoText"
                value={formData.logoText}
                onChange={handleInputChange}
                className="rounded-md border border-border px-3 py-2"
                placeholder="Ex: ZR"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              Website
              <input
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="rounded-md border border-border px-3 py-2"
                placeholder="https://example.com"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Industry
              <input
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="rounded-md border border-border px-3 py-2"
                placeholder="Software"
              />
            </label>
          </div>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
              {submitting ? "Saving..." : "Save Company"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCompany
