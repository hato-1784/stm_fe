// pages/login.js

import { useState } from 'react'
import { useRouter } from 'next/router'

export default function LoginPage() {

  // フォームの値を管理するためのstate
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // ルーティング処理を行うための関数
  const router = useRouter()
  // ログイン処理
  async function handleLogin() {

    const response = await fetch('http://127.0.0.1:8000/login', {
      method: 'POST',
      body: JSON.stringify({email, password})
    })

    if(response.ok) {
      router.push('/dashboard')
    } else {
      // 失敗時の処理
    }

  }

  return (
    <div>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Log in</button>

    </div>
  )

}