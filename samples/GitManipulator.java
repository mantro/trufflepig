package tools;

import java.io.File;
import java.io.IOException;

public class GitManipulator {
	private static final String username = "hulub";
	private static final String password = "vreau3krjewhSMi";
	private static final String repository_path = "github.com/hulub/eos.git";

	public static void initialize() {
		File directory = new File(FileManipulator.getEosFilename());
		if (directory.exists()) {
			pullGitRepo();
		} else
			cloneGitRepo();
	}

	public static void pushGitRepo() {
		File directory = new File("eos/");
		try {
			Runtime.getRuntime().exec(new String[] { "git", "add", "." }, null, directory).waitFor();
			Runtime.getRuntime().exec(new String[] { "git", "commit", "-m", "automatic commit" }, null, directory)
					.waitFor();
			Runtime.getRuntime().exec(new String[] { "git", "push",
					"https://" + username + ":" + password + "@" + repository_path, "--all" }, null, directory)
					.waitFor();
		} catch (IOException | InterruptedException e) {
			System.out.println("Problems while push git repo");
		}
	}

	private static void pullGitRepo() {
		File directory = new File("eos/");
		try {
			Runtime.getRuntime().exec(new String[] { "git", "reset", "--hard", "origin/master" }, null, directory)
					.waitFor();
			Runtime.getRuntime().exec(new String[] { "git", "pull", "origin", "master" }, null, directory).waitFor();
		} catch (InterruptedException | IOException e) {
			System.out.println("Problems while pull git repo");
		}
	}

	private static void cloneGitRepo() {
		try {
			Runtime.getRuntime().exec(new String[] { "git", "clone", "http://" + repository_path }).waitFor();
		} catch (IOException | InterruptedException e) {
			System.out.println("Problems while clone git repo");
		}
	}
}
