
const express = require("express");
const { registerUser, loginUser, addUserTask, displayUsersTasks, deleteUserTask, updateUserTask, markTaskAsComplete,
    sendResetPasswordEmail, resetUserPassword, sendReminderEmail,deleteUsersAllTasks } = require("../controllers/UserController");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");


const router = express.Router();

const authenticateUser = async (req, res, next) => {
    if (req.headers.authorization) {
        const [, token] = req.headers.authorization.split(" ");
        console.log('This is user sent token', token);

        if (token === 'undefined') {
            console.log('In main if');
            return res.json({
                message: 'Please login',
                status: 404,
            })
        } else {
            console.log('in main else');
            const userData = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log('userData', userData);
            req.user = userData
            next();
        }
    } else {
        res.json({
            message: 'Please login',
            status: 404,
        })
    }
}

router.get("/get-authenticated-user", authenticateUser, (req, res) => {
    res.json({
        success: true,
        userData: req.user,
        status: 200,
    })
});

router.get("/send-reminder-email",authenticateUser,sendReminderEmail)

cron.schedule('* * * * * *', async function () {
    try {
        // console.log('aaa', req.user);
    } catch (err) {
        // console.log(err)
    }
})


router.get("/users-all-tasks", authenticateUser, displayUsersTasks);
router.delete("/delete-user-task/:taskId", authenticateUser, deleteUserTask);
router.delete("/delete-users-all-tasks",authenticateUser,deleteUsersAllTasks)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/add-user", authenticateUser, addUserTask)
router.post("/update-user-task/:taskId", authenticateUser, updateUserTask);
router.post("/update-task-status/:taskId", authenticateUser, markTaskAsComplete);
router.post("/send-forgot-password-email", sendResetPasswordEmail);
router.post("/reset-user-password", resetUserPassword);

module.exports = router;