import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState } from "react"
import CompanyCard from "@/components/CompanyCard"
import { useLocation, useNavigate } from "react-router-dom"
import api from "@/services/api"

const Home = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [companies, setCompanies] = useState([])
    const [locationInput, setLocationInput] = useState("")
    const [locationFilter, setLocationFilter] = useState("")
    const [sortBy, setSortBy] = useState("name")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const loadCompanies = async () => {
            try {
                setLoading(true)
                setError("")
                const response = await api.getAllCompanies("", locationFilter, sortBy)
                setCompanies(response.data || [])
            } catch (err) {
                setError(err.message || "Failed to load companies")
            } finally {
                setLoading(false)
            }
        }

        loadCompanies()
    }, [location.pathname, locationFilter, sortBy])

    const companiesWithCardData = useMemo(
        () =>
            companies.map((company) => ({
                ...company,
                id: company._id,
                logo: company.logoText || "C",
                logoBg: "bg-[#6d28d9]",
                address: company.address || company.city,
                foundedOn: company.createdAt ? new Date(company.createdAt).toLocaleDateString("en-GB") : "N/A",
            })),
        [companies]
    )

    const filteredCompanies = useMemo(() => {
        return companiesWithCardData.filter((company) => {
            const matchesLocation = !locationFilter || company.city.toLowerCase().includes(locationFilter.toLowerCase())
            return matchesLocation
        })
    }, [companiesWithCardData, locationFilter])

    const sortedCompanies = useMemo(() => {
        return [...filteredCompanies].sort((a, b) => {
            if (sortBy === "rating") return b.rating - a.rating
            if (sortBy === "reviews") return b.reviewsCount - a.reviewsCount
            if (sortBy === "newest") return b.id - a.id
            return a.name.localeCompare(b.name)
        })
    }, [filteredCompanies, sortBy])

    const handleFindCompany = () => {
        setLocationFilter(locationInput.trim())
    }

    return (
        <div className="min-h-screen bg-[#f7f7f7]">
            <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
                <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm md:p-6">
                    <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-end">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="city-search" className="text-sm text-muted-foreground">
                                Select City
                            </label>
                            <div className="relative">
                                <input
                                    id="city-search"
                                    type="text"
                                    placeholder="Indore, Madhya Pradesh, India"
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 pl-10 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <svg className="absolute left-3 top-2.5 h-4 w-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>

                        <Button className="bg-violet-600 hover:bg-violet-700" onClick={handleFindCompany}>
                            Find Company
                        </Button>

                        <Button className="bg-violet-600 hover:bg-violet-700" onClick={() => navigate("/addCompany")}>
                            + Add Company
                        </Button>

                        <div className="flex items-center gap-2">
                            <label htmlFor="sort" className="text-sm text-muted-foreground">
                                Sort:
                            </label>
                            <select
                                id="sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary md:w-44"
                            >
                                <option value="name">Name</option>
                                <option value="rating">Rating</option>
                                <option value="reviews">Most Reviews</option>
                                <option value="newest">Newest Added</option>
                            </select>
                        </div>
                    </div>

                </div>
                <hr className="border-border" />

            </div>


            <div className="mx-auto max-w-6xl px-4 pb-10">
                <div className="flex flex-col gap-4">
                    {loading ? (
                        <div className="rounded-lg border border-dashed border-border bg-muted/20 py-12 text-center text-muted-foreground">
                            Loading companies...
                        </div>
                    ) : error ? (
                        <div className="rounded-lg border border-dashed border-red-300 bg-red-50 py-12 text-center text-red-700">
                            {error}
                        </div>
                    ) : sortedCompanies.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {sortedCompanies.map((company) => (
                                <CompanyCard key={company.id} company={company} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 py-16">
                            <svg className="mb-4 h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10a4 4 0 018 0m-9 4h.01M15 20H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z"
                                />
                            </svg>
                            <h3 className="mb-2 text-lg font-semibold text-foreground">No companies found</h3>
                            <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home
