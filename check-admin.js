const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function checkAndFixAdmin() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'thfaihub@gmail.com' }
        })

        if (!user) {
            console.log('❌ User not found!')
            return
        }

        console.log('✅ User found in database')
        console.log('Email:', user.email)
        console.log('Username:', user.username)
        console.log('Role:', user.role)
        console.log('Stored Hash:', user.password.substring(0, 20) + '...')

        // Test password
        const testPassword = 'Thfaihub(*)'
        const matches = await bcrypt.compare(testPassword, user.password)

        console.log('\nPassword Test Result:', matches ? '✅ MATCH' : '❌ NO MATCH')

        if (!matches) {
            console.log('\n🔧 Fixing password...')
            const newHash = await bcrypt.hash(testPassword, 10)
            await prisma.user.update({
                where: { email: 'thfaihub@gmail.com' },
                data: { password: newHash }
            })
            console.log('✅ Password updated successfully!')
        }

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkAndFixAdmin()
