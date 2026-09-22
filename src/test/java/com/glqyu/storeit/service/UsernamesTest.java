package com.glqyu.storeit.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UsernamesTest {

	@Test
	void acceptsPlainNamesAndRejectsPathTricks() {
		assertThatCode(() -> Usernames.check("alice.01_b-c")).doesNotThrowAnyException();
		assertThatThrownBy(() -> Usernames.check("")).isInstanceOf(IllegalArgumentException.class);
		assertThatThrownBy(() -> Usernames.check(".")).isInstanceOf(IllegalArgumentException.class);
		assertThatThrownBy(() -> Usernames.check("..")).isInstanceOf(IllegalArgumentException.class);
		assertThatThrownBy(() -> Usernames.check("../evil")).isInstanceOf(IllegalArgumentException.class);
		assertThatThrownBy(() -> Usernames.check("a/b")).isInstanceOf(IllegalArgumentException.class);
		assertThatThrownBy(() -> Usernames.check("a b")).isInstanceOf(IllegalArgumentException.class);
	}
}
