import { PageHeader } from "./header"
import { PageMain } from "./main"
import PageFooter from "./footer"

export const HomePage = () => {
    return (
        <div className="h-screen bg-purple-300">
            <PageHeader />
            <PageMain />
            <PageFooter />
        </div>
    )
}