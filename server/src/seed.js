import bcrypt from 'bcryptjs';
import College from './models/College.js';
import User from './models/User.js';
import Verification from './models/Verification.js';
import ServiceRequest from './models/ServiceRequest.js';
import ServiceListing from './models/ServiceListing.js';
import MarketplaceItem from './models/MarketplaceItem.js';
import Post from './models/Post.js';
import Notice from './models/Notice.js';
import CollegeReview from './models/CollegeReview.js';
import FresherGuide from './models/FresherGuide.js';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';

export async function seedIfEmpty() {
    if (await College.exists({})) return;
    const hash = (p) => bcrypt.hashSync(p, 10);

    const [cu, chitkara] = await College.insertMany([
        {
            name: 'Chandigarh University', slug: 'chandigarh-university', city: 'Mohali', state: 'Punjab',
            description: 'Private university in Mohali known for engineering and lively campus life.'
        },
        {
            name: 'Chitkara University', slug: 'chitkara-university', city: 'Rajpura', state: 'Punjab',
            description: 'Multidisciplinary university offering engineering, business, design and health sciences.'
        },
    ]);

    const [admin, riya, arjun, neha, pending] = await User.insertMany([
        { name: 'Platform Admin', email: 'admin@campuscrew.dev', passwordHash: hash('admin123'), role: 'admin', status: 'verified' },
        {
            name: 'Riya Sharma', email: 'riya@cu.dev', passwordHash: hash('student123'), collegeId: cu._id, status: 'verified',
            department: 'Computer Science', year: 3, bio: 'Full-stack dev', skills: ['React', 'Node.js'], avatarUrl: 'https://i.pravatar.cc/150?img=47'
        },
        {
            name: 'Arjun Verma', email: 'arjun@cu.dev', passwordHash: hash('student123'), collegeId: cu._id, status: 'verified',
            department: 'IT', year: 2, bio: 'Designer', skills: ['Figma', 'Premiere'], avatarUrl: 'https://i.pravatar.cc/150?img=12'
        },
        {
            name: 'Neha Kaur', email: 'neha@chitkara.dev', passwordHash: hash('student123'), collegeId: chitkara._id, status: 'verified',
            department: 'Design', year: 4, avatarUrl: 'https://i.pravatar.cc/150?img=32'
        },
        {
            name: 'Kabir Singh', email: 'kabir@cu.dev', passwordHash: hash('student123'), collegeId: cu._id, status: 'pending',
            department: 'Mechanical', year: 1
        },
    ]);

    await Verification.create({ userId: pending._id, collegeId: cu._id, method: 'manual', status: 'pending' });

    const req = await ServiceRequest.create({
        collegeId: cu._id, author: arjun._id,
        title: 'Need help building a portfolio website',
        description: 'React portfolio site, 3 pages, contact form. Deadline in 2 weeks.',
        category: 'Web Development', budgetMin: 1200, budgetMax: 2500, proposalCount: 1,
    });

    await ServiceListing.insertMany([
        { collegeId: cu._id, provider: riya._id, title: 'React portfolio websites', category: 'Web Development', price: 1500 },
        { collegeId: cu._id, provider: arjun._id, title: 'Presentation design', category: 'Design', price: 300 },
    ]);

    await MarketplaceItem.insertMany([
        {
            collegeId: cu._id, seller: riya._id, title: 'Engineering Maths textbook', category: 'Books',
            condition: 'like-new', price: 350, images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600']
        },
        {
            collegeId: cu._id, seller: arjun._id, title: 'Hero Sprint bicycle', category: 'Bicycles',
            condition: 'good', price: 4500, images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600']
        },
    ]);

    await Post.insertMany([
        {
            collegeId: cu._id, author: riya._id, text: 'Library at 8pm hits different 📚',
            media: ['https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=900'],
            visibility: 'public-nominated', publicationState: 'approved', likes: [arjun._id]
        },
        { collegeId: cu._id, author: arjun._id, text: 'Football match this Saturday ⚽', publicationState: 'private' },
    ]);

    await Notice.insertMany([
        {
            collegeId: cu._id, author: admin._id, title: 'HackCU 2025 — registrations open',
            body: '36-hour hackathon', category: 'Hackathon', sourceLabel: 'official',
            eventDate: new Date(Date.now() + 14 * 864e5), location: 'Auditorium'
        },
    ]);

    await CollegeReview.create({
        collegeId: cu._id, author: riya._id, title: 'Great coding culture',
        text: 'Faculty is supportive, labs well equipped.', status: 'approved',
        ratings: { academics: 4, faculty: 5, facilities: 4, hostel: 3, food: 3, placements: 4 },
    });
    await FresherGuide.create({
        collegeId: cu._id, author: arjun._id, title: 'First-week packing list',
        text: 'Bring an extension board, desk lamp, mattress topper.', status: 'approved',
    });

    const convo = await Conversation.create({ collegeId: cu._id, participants: [arjun._id, riya._id], lastMessage: 'Sure!' });
    await Message.create({ conversation: convo._id, sender: riya._id, text: 'Sure!', readBy: [riya._id] });

    console.log('🌱 Seeded');
    console.log('   riya@cu.dev / arjun@cu.dev / neha@chitkara.dev — password: student123');
    console.log('   admin@campuscrew.dev / admin123');
}

if (process.argv[1]?.endsWith('seed.js')) {
    const { connectDB } = await import('./config/db.js');
    await connectDB();
    await seedIfEmpty();
    process.exit(0);
}