import { useEffect, useState } from "react"

function useGetPin() {
    const [pin, setPin] = useState('')
    const [encodedValue] = useState<string | null>(null)

    useEffect(() => {
        const pin = localStorage.getItem('pin')
        if(pin) {
            setPin(pin)
        }
    }, [])

    return { pin, encodedValue }
}
``
export default useGetPin