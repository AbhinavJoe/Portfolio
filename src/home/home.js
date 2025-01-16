import { PageHeader } from "./header"
import { PageMain } from "./main"
import PageFooter from "./footer/footer"

export const HomePage = () => {
    return (
        <div className="h-screen w-3/4 mx-auto">
            <PageHeader />
            <PageMain />
            <PageFooter />
            <div className='static bottom-0 left-0 text-purple-200'>Abhinav Joshi | @AbhinavJoe &copy;</div>
        </div>
    )
}