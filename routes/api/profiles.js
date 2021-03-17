import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import ProtectedRoute from '../../middleware/auth.js';
import Profile from '../../models/Profile.js';

const router = Router();

// @route   POST api/profiles/create
// @desc    Create or update profile
// @access  Privet
router.post(
	'/create',
	[check('status', 'Status is required').not().isEmpty(), ProtectedRoute],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const {
			company,
			website,
			location,
			status,
			bio,
			github,
			youtube,
			twitter,
			facebook,
			linkedin,
			instagram,
		} = req.body;

		let profileFields = {};
		profileFields.user = req.user.id;
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (status) profileFields.status = status;
		if (bio) profileFields.bio = bio;
		profileFields.social = {};
		if (github) profileFields.social.github = github;
		if (youtube) profileFields.social.youtube = youtube;
		if (twitter) profileFields.social.twitter = twitter;
		if (facebook) profileFields.social.facebook = facebook;
		if (linkedin) profileFields.social.linkedin = linkedin;
		if (instagram) profileFields.social.instagram = instagram;

		try {
			let profile = await Profile.findOne({ user: req.user.id });
			// Update profile
			if (profile) {
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				);
				return res.json(profile);
			}
			profile = new Profile(profileFields);
			await profile.save();
			return res.json(profile);
		} catch (error) {
			console.error(error);
			res.status(500).send('Server error');
		}
	}
);

export default router;