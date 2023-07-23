import {CaslAction, CaslSubject, PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

const main = async () => {
    
    const admin = await prisma.role.create({
        data: {
            name: "admin", 
            permissions: {
                createMany: {
                    data: [
                        {
                            action: CaslAction.MANAGE,
                            subject: CaslSubject.Category
                        },
                        {
                            action: CaslAction.READ,
                            subject: CaslSubject.Category
                        },
                        {
                            action: CaslAction.CREATE,
                            subject: CaslSubject.Category
                        },
                        {
                            action: CaslAction.UPDATE,
                            subject: CaslSubject.Category
                        },
                        {
                            action: CaslAction.DELETE,
                            subject: CaslSubject.Category
                        },
                        {
                            action: CaslAction.MANAGE,
                            subject: CaslSubject.User
                        }
                    ]
                }
            }
        }
    });

    const anonymous = await prisma.role.create({
        data: {
            name: "anonymous",
            permissions: {
                createMany: {
                    data: [
                        {
                            action: CaslAction.READ,
                            subject: CaslSubject.Category
                        }
                    ]
                }
            }
        }
    });

    const user = await prisma.role.create({
        data: {
            name: "user",
            permissions: {
                createMany: {
                    data: [
                        {
                            action: CaslAction.READ,
                            subject: CaslSubject.Category
                        }
                    ]
                }
            }
        }
    });

    const firstUser = await prisma.user.findFirst({orderBy: {id: "asc"}});
    await prisma.user.update({
        where: {
            id: firstUser.id
        },
        data: {
            roles: {
                connect: [
                    {id: admin.id}
                ]
            }
        }
    });
}

main().then(async () => {
    await prisma.$disconnect()
    console.log("sedd done")
}).catch(async (e) => {
    await prisma.$disconnect()
    console.log(e)
});