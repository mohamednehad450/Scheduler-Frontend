import { Button, Card, Center, Container, Tab, Tabs, TextInput, Text, LoadingOverlay } from "@mantine/core"
import { useEffect, useState } from "react";
import { useAuth } from "../context";

type FormError = {
    username: string
    password: string
    confirm: string
}


const SignInCard = () => {


    const [activeTab, setActiveTab] = useState(0);

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const [formError, setFormError] = useState<Partial<FormError>>({})
    const [signError, setSignError] = useState('')

    useEffect(() => {
        setFormError({})
    }, [password, username, confirm,])


    useEffect(() => {
        setUsername("")
        setPassword("")
        setConfirm("")
    }, [activeTab])

    const auth = useAuth()

    return (
        <Container>
            {auth?.state === 'loading' ?
                <LoadingOverlay visible={auth?.state === 'loading'} />
                : (
                    <Center>
                        <Card shadow="sm" m="lg" radius={'md'} style={{ width: "20rem" }} >
                            <Tabs
                                active={activeTab}
                                onTabChange={(n) => {
                                    setActiveTab(n)
                                    setSignError('')
                                }}
                            >
                                <Tab label='Sign in'>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault()
                                            auth?.login(username, password)
                                                .catch(err => {
                                                    const status = err?.response?.status || 0
                                                    if (status === 404) {
                                                        setFormError(err => ({ ...err, username: 'Incorrect username' }))
                                                        return
                                                    }
                                                    if (status === 403) {
                                                        setFormError(err => ({ ...err, password: 'Incorrect password' }))
                                                        return
                                                    }
                                                    if (status === 409) {
                                                        setActiveTab(1)
                                                        setSignError('Admin account is not registered yet.')

                                                    }
                                                })
                                        }}
                                    >
                                        <TextInput
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            mt="xs"
                                            type="text"
                                            required
                                            label="Username"
                                            error={formError.username}
                                        />
                                        <TextInput
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            mt="xs"
                                            type="password"
                                            required
                                            label="Password"
                                            error={formError.password}
                                        />
                                        <Text size="sm" mt="xs" color={'red'}>{signError}</Text>
                                        <Button my="md" type="submit">
                                            Sign in
                                        </Button>


                                    </form>
                                </Tab>
                                <Tab label='Register'>
                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        const regex = new RegExp(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{6,}$/)
                                        if (confirm !== password) {
                                            setFormError(err => ({ ...err, confirm: 'Passwords must match' }))
                                            return
                                        }
                                        if (password.length < 6) {
                                            setFormError(err => ({ ...err, password: 'Passwords must be at least 6 characters long' }))
                                            return
                                        }
                                        if (!regex.test(password)) {
                                            setFormError(err => ({ ...err, password: 'Passwords must have at least 1 upper case letter and 1 number' }))
                                            return
                                        }
                                        auth?.register(username, password)
                                            .catch(err => {
                                                const status = err?.response?.status || 0
                                                if (status === 409) {
                                                    setActiveTab(0)
                                                    setSignError('Admin account is already registered')
                                                }
                                                else {
                                                    setSignError('Failed to register admin account: unknown error')
                                                }
                                            })

                                    }}>

                                        <TextInput
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            my="xs"
                                            type="text"
                                            required
                                            label="Username"
                                            error={formError.username}
                                        />
                                        <TextInput
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            my="xs"
                                            type="password"
                                            required
                                            label="Password"
                                            error={formError.password}

                                        />
                                        <TextInput
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                            my="xs"
                                            type="password"
                                            required
                                            label="Confirm password"
                                            error={formError.confirm}
                                        />
                                        <Text size="sm" mt="xs" color={'red'}>{signError}</Text>
                                        <Button type="submit" my="md"
                                        >
                                            Register
                                        </Button>
                                    </form>
                                </Tab>
                            </Tabs>
                        </Card>
                    </Center>
                )
            }
        </Container>
    )
}


export default SignInCard