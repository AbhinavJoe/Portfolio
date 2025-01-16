import { PageHeader } from "./header"
import { PageMain } from "./main"
import PageFooter from "./footer/footer"

export const HomePage = () => {
    return (
        <div className="h-screen w-3/4 mx-auto">
            <PageHeader />
            <PageMain />
            <PageFooter />
        </div>
    )
}