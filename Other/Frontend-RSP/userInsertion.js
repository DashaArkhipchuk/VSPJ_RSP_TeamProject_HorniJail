

const url = "https://backend-rsp/users/";

const users = [
    { login: "johndoe", password: "johndoepass", role: 1 },
    { login: "janesmith", password: "janesmithpass", role: 1 },
    { login: "michaelbrown", password: "michaelbrownpass", role: 1 },
    { login: "sarahjohnson", password: "sarahjohnsonpass", role: 1 },
    { login: "chrislee", password: "chrisleepass", role: 1 },
    { login: "davidwilson", password: "davidwilsonpass", role: 1 },
    { login: "emilyclark", password: "emilyclarkpass", role: 1 },
    { login: "jamesharris", password: "jamesharrispass", role: 1 },
    { login: "lindalewis", password: "lindalewispass", role: 1 },
    { login: "robertwalker", password: "robertwalkerpass", role: 1 },
    { login: "oliviayoung", password: "oliviayoungpass", role: 1 },
    { login: "williamhall", password: "williamhallpass", role: 1 },
    { login: "sophiaallen", password: "sophiaallenpass", role: 1 },
    { login: "danielking", password: "danielkingpass", role: 1 },
    { login: "isabellascott", password: "isabellascottpass", role: 1 },
    { login: "jackwhite", password: "jackwhitepass", role: 1 },
    { login: "miaadams", password: "miaadamspass", role: 1 },
    { login: "ethanmitchell", password: "ethanmitchellpass", role: 1 },
    { login: "charlottegonzalez", password: "charlottegonzalezpass", role: 1 },
    { login: "benjaminperez", password: "benjaminperezpass", role: 1 },
    { login: "ameliaturner", password: "ameliaturnerpass", role: 1 },
    { login: "jacobharris", password: "jacobharrispass", role: 1 },
    { login: "ellacarter", password: "ellacarterpass", role: 1 },
    { login: "alexanderrivera", password: "alexanderriverapass", role: 1 },
    { login: "averymurphy", password: "averymurphypass", role: 1 },
    { login: "liamgreen", password: "liamgreenpass", role: 1 },
    { login: "sophiebaker", password: "sophiebakerpass", role: 1 },
    { login: "lucasnelson", password: "lucasnelsonpass", role: 1 },
    { login: "chloecarter", password: "chloecarterpass", role: 1 },
    { login: "masonmitchell", password: "masonmitchellpass", role: 1 }
];

const createUsers = async () => {
    for (const user of users) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });

            if (response.ok) {
                console.log(`User ${user.login} created successfully.`);
            } else {
                console.error(`Failed to create user ${user.login}:`, await response.text());
            }
        } catch (error) {
            console.error(`Error creating user ${user.login}:`, error);
        }
    }
};

createUsers();