const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
    try {
        // Check if user already exists
        const existing = await prisma.user.findUnique({
            where: { email: 'thfaihub@gmail.com' }
        })

        if (existing) {
            console.log('User already exists. Updating to ADMIN role...')
            await prisma.user.update({
                where: { email: 'thfaihub@gmail.com' },
                data: {
                    role: 'ADMIN',
                    name: 'Hashir Adnan',
                    username: 'thfnexusai'
                }
            })
            console.log('✅ User updated successfully!')
        } else {
            // Hash password
            const hashedPassword = await bcrypt.hash('Thfaihub(*)', 10)

            // Create admin user
            await prisma.user.create({
                data: {
                    email: 'thfaihub@gmail.com',
                    password: hashedPassword,
                    name: 'Hashir Adnan',
                    username: 'thfnexusai',
                    role: 'ADMIN',
                    plan: 'PREMIUM',
                    credits: 500
                }
            })
            console.log('✅ Admin user created successfully!')
        }

        console.log('\n📧 Email: thfaihub@gmail.com')
        console.log('🔑 Password: Thfaihub(*)')
        console.log('👤 Username: thfnexusai')
        console.log('✨ Role: ADMIN')
        console.log('💳 Plan: PREMIUM')
        console.log('🪙 Credits: 500')

    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

createAdmin()
