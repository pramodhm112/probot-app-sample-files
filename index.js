/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
const {
	Octokit
} = require("@octokit/rest");
const {
	paginateRest,
	composePaginateRest,
} = require("@octokit/plugin-paginate-rest");
const createConnectionPool = require('@databases/pg');
const {
	sql
} = require('@databases/pg');

const MyOctokit = Octokit.plugin(paginateRest);
const octokit = new MyOctokit();

module.exports = (app) => {
	app.log.info("Yay, the app was loaded!");
	//  app.on("organization.member_added", async (context) => {
	//  app.log.info(context);
	// 	context.log.info({ event: context.name, action: context.payload.action });
	// 	context.log.info({ name: context.payload.membership.user.login });

	//  const username = context.payload.membership.user.login

	//  return context.octokit.issues.create ({
	// 	  owner: "github-devtools-2022",
	// 	  repo: "jira-webhook-test",
	// 	  title: "Welcome to Organization",
	// 	  body: "Hi, " + username,
	// 	  });
	//   });

	// const db = createConnectionPool(
	// 	'postgres://amdkrflh:48IVs2PxyADb9kcpQvS9HJvm4rdw7d8Q@arjuna.db.elephantsql.com/amdkrflh',
	//   );

	app.on(["create"], async (context) => {
		//  "repository.created"
		//app.log.info("context is: " + context.payload);
		//app.log.info("context action is: " + context.payload.action);

		//context.log.info({ event: context.name, action: context.payload.action });
		//app.log.info(context.name.action.event);
		//const event = context.name + "." + context.payload.action;
		//app.log.info(event);

		const data = context;
		var organization = data.payload.repository.owner.login;
		var repository = data.payload.repository.name;
		var default_branch = data.payload.repository.default_branch;

		var branchProtected = await context.octokit.rest.repos.getBranchProtection({
			owner: organization,
			repo: repository,
			branch: "dev-1"
		}).catch(error => {
			app.log.info("error status is:" + error.status);
			return error;
		});

		//console.log(branchProtected);

		app.log.info(branchProtected.status);

		app.log.info(branchProtected.data);

		// async function getBranchProtection() {
		// 	try {

				
		// 		.catch(error => {
		// 			app.log.info("error status is:" + error.status);
		// 			return error;
		// 		});
				
		// 		// app.log.info(data);
		// 		return branchProtected;

		// 	} catch (error) {
		// 		app.log.info(error);
		// 	}
		// }

		if (data.payload.ref) {
			app.log.info("ref is: " + data.payload.ref);
			app.log.info("default_branch is: " + data.payload.repository.default_branch);

			var organization = data.payload.repository.owner.login;
			var repository = data.payload.repository.name;
			var default_branch = data.payload.repository.default_branch;

			// const branchProtectionRule = getBranchProtection();
			// app.log.info(branchProtectionRule);

			return context.octokit.repos.updateBranchProtection({
				owner: organization,
				repo: repository,
				branch: default_branch,
				required_pull_request_reviews: {
					dismiss_stale_reviews: true,
					require_code_owner_reviews: true,
					required_approving_review_count: 1
				},
				restrictions: null,
				enforce_admins: null,
				required_status_checks: null
			});

		}

		// async function getBranchProtection() {
		// 	try {
		// 		const {
		// 			data
		// 		} = await context.octokit.rest.repos.getBranchProtection({
		// 			owner: organization,
		// 			repo: repository,
		// 			branch: default_branch,
		// 		});
		// 		app.log.info(data);
		// 	} catch (error) {
		// 		app.log.info(error);
		// 	}
		// }
		// if (data == "create") {
		// 	app.log.info("create");
		// }
		// else if (data == "repository.created") {
		// 	app.log.info("repository.created");
		// }


	});

};
