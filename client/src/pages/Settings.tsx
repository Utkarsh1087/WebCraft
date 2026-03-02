import { AccountSettingsCards, ChangePasswordCard, DeleteAccountCard } from "@daveyplate/better-auth-ui"


const Settings = () => {
    return (
        <div className="flex-col gap-6 flex py-12 w-full p-4 flex justify-center items-center min-h-[90vh]">
            <AccountSettingsCards
                classNames={{
                    card: {
                        base: 'bg-card border-border border shadow-lg max-w-xl mx-auto',
                        footer: 'bg-card border-border border-t',
                    }
                }} />
            <div className="w-full">
                <ChangePasswordCard classNames={{
                    base: 'bg-card border-border border shadow-lg max-w-xl mx-auto',
                    footer: 'bg-card border-border border-t',

                }} />
            </div>
            <div className="w-full">
                <DeleteAccountCard classNames={{
                    base: 'bg-card border-border border shadow-lg max-w-xl mx-auto',
                }} />
            </div>
        </div>
    )
}

export default Settings