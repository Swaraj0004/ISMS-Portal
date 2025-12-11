const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function dbConnect() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    return mongoose.connect(MONGODB_URI);
}

const managerSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    role: String,
});

const projectSchema = new mongoose.Schema({
    title: String,
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' },
    interns: [{
        intern: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern' }
    }]
});

const internSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    projectsAssigned: [{
        project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
    }]
});

const Manager = mongoose.models.Manager || mongoose.model('Manager', managerSchema);
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
const Intern = mongoose.models.Intern || mongoose.model('Intern', internSchema);

async function debug() {
    await dbConnect();
    console.log('Connected to DB');

    const managers = await Manager.find({});
    console.log(`Found ${managers.length} managers`);

    for (const m of managers) {
        console.log(`\nManager: ${m.fullName} (${m._id})`);
        const projects = await Project.find({ manager: m._id });
        console.log(`  Projects: ${projects.length}`);

        for (const p of projects) {
            console.log(`    - Project: ${p.title} (${p._id})`);
            console.log(`      Interns count: ${p.interns.length}`);
        }
    }

    console.log('\n--- Checking Interns ---');
    const allInterns = await Intern.find({});
    console.log(`Found ${allInterns.length} interns in total`);

    for (const i of allInterns) {
        console.log(`\nIntern: ${i.fullName} (${i._id})`);
        if (i.projectsAssigned && i.projectsAssigned.length > 0) {
            console.log(`  Assigned to ${i.projectsAssigned.length} projects:`);
            for (const pa of i.projectsAssigned) {
                console.log(`    - Project ID: ${pa.project}`);
            }
        } else {
            console.log('  No projects assigned');
        }
    }

    process.exit(0);
}

debug().catch(console.error);
